"""
Fix Generator Agent
===================
Uses an LLM (OpenAI GPT-4 or local Ollama) to generate minimal code fixes.
Falls back to rule-based fixes when LLM is unavailable.
"""

import os
import re
import ast
import textwrap
from typing import Any, Optional

try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class FixGeneratorAgent:
    """Generates minimal diffs to fix a classified bug."""

    def __init__(self):
        self.llm_client = None
        if OPENAI_AVAILABLE and os.getenv("OPENAI_API_KEY"):
            self.llm_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate_fix(
        self, failure: dict[str, Any], bug_type: str, repo_path: str
    ) -> Optional[dict[str, Any]]:
        """Generate a fix for the given failure."""
        file_path = failure.get("file", "")
        line_num = failure.get("line", 0)
        error_context = failure.get("error_context", "")

        # Try to read the actual file
        full_path = os.path.join(repo_path, file_path)
        if not os.path.exists(full_path):
            full_path = self._find_file(repo_path, file_path)
            if not full_path:
                return None

        with open(full_path, "r", errors="ignore") as f:
            content = f.read()

        # Try LLM first
        if self.llm_client:
            fixed = await self._llm_fix(content, error_context, bug_type, line_num)
            if fixed and fixed != content:
                return {
                    "file": file_path,
                    "full_path": full_path,
                    "line": line_num,
                    "original_content": content,
                    "fixed_content": fixed,
                }

        # Rule-based fallback
        fixed = self._rule_based_fix(content, bug_type, line_num, error_context)
        if fixed and fixed != content:
            return {
                "file": file_path,
                "full_path": full_path,
                "line": line_num,
                "original_content": content,
                "fixed_content": fixed,
            }

        return None

    async def _llm_fix(
        self, content: str, error_context: str, bug_type: str, line_num: int
    ) -> Optional[str]:
        """Use GPT-4 to generate a minimal fix."""
        prompt = f"""You are an expert code repair agent. Fix the following {bug_type} bug.

ERROR CONTEXT:
{error_context}

FILE CONTENT (around line {line_num}):
{content[:3000]}

Return ONLY the complete fixed file content. No explanations. No markdown code blocks.
The fix should be minimal - change only what's necessary to fix the {bug_type} error."""

        try:
            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=4000,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"[LLM] Error: {e}")
            return None

    def _rule_based_fix(
        self, content: str, bug_type: str, line_num: int, error_context: str
    ) -> Optional[str]:
        """Apply heuristic fixes based on bug type."""
        lines = content.splitlines(keepends=True)

        if bug_type == "INDENTATION" and 0 < line_num <= len(lines):
            # Auto-fix indentation using 4 spaces
            fixed_lines = []
            for line in lines:
                if line.startswith("\t"):
                    line = line.replace("\t", "    ")
                fixed_lines.append(line)
            return "".join(fixed_lines)

        if bug_type == "SYNTAX" and 0 < line_num <= len(lines):
            # Try common syntax fixes: missing colon, unclosed bracket
            target = lines[line_num - 1].rstrip()
            if re.match(r"^\s*(if|else|elif|for|while|def|class|try|except|finally|with)\b", target):
                if not target.endswith(":"):
                    lines[line_num - 1] = target + ":\n"
                    return "".join(lines)

        if bug_type == "IMPORT":
            # Add missing __init__.py or fix relative imports
            if "relative import" in error_context.lower():
                return content.replace("from .", "from ")

        if bug_type == "LINTING":
            # Remove trailing whitespace
            fixed = "\n".join(line.rstrip() for line in content.splitlines())
            if fixed != content.rstrip():
                return fixed + "\n"

        return None

    def apply_fix(self, fix: dict[str, Any], repo_path: str) -> bool:
        """Write the fixed content to disk."""
        try:
            with open(fix["full_path"], "w") as f:
                f.write(fix["fixed_content"])
            return True
        except Exception as e:
            print(f"[FixGen] Failed to apply fix: {e}")
            return False

    def _find_file(self, repo_path: str, file_path: str) -> Optional[str]:
        """Search for a file by name in the repo."""
        filename = os.path.basename(file_path)
        for root, _, files in os.walk(repo_path):
            if filename in files:
                return os.path.join(root, filename)
        return None
