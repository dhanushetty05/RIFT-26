"""
Analyzer Agent
==============
Parses raw test output / error logs into structured failure objects.
"""

import re
from typing import Any


class AnalyzerAgent:
    """Parses raw error logs into structured failure records."""

    # Patterns for common error formats (Python pytest, Node jest)
    PYTHON_ERROR_PATTERN = re.compile(
        r"(?:ERROR|FAILED|Error)\s+(.+?)(?::(\d+))?(?::|\s+)(.+?)(?:\n|$)",
        re.MULTILINE,
    )
    NODE_ERROR_PATTERN = re.compile(
        r"at .+? \((.+?):(\d+):\d+\)|(?:Error|TypeError|SyntaxError):\s+(.+?)(?:\n|$)",
        re.MULTILINE,
    )
    TRACEBACK_FILE_PATTERN = re.compile(r'File "(.+?)", line (\d+)')
    IMPORT_ERROR_PATTERN = re.compile(r"ImportError|ModuleNotFoundError|Cannot find module")
    SYNTAX_ERROR_PATTERN = re.compile(r"SyntaxError|IndentationError")
    TYPE_ERROR_PATTERN = re.compile(r"TypeError|AttributeError")

    def analyze(self, error_log: str) -> list[dict[str, Any]]:
        """Parse error log into list of failure dicts."""
        failures = []
        seen = set()

        # Python traceback parsing
        for match in self.TRACEBACK_FILE_PATTERN.finditer(error_log):
            file_path = match.group(1)
            line_num = int(match.group(2))
            key = (file_path, line_num)

            if key not in seen:
                seen.add(key)
                # Extract the error message around this point
                start = max(0, match.start() - 50)
                end = min(len(error_log), match.end() + 200)
                context = error_log[start:end]

                failures.append({
                    "file": file_path,
                    "line": line_num,
                    "error_context": context.strip(),
                    "raw_log": error_log,
                })

        # Node.js error parsing
        if not failures:
            for match in self.NODE_ERROR_PATTERN.finditer(error_log):
                if match.group(1) and match.group(2):
                    file_path = match.group(1)
                    line_num = int(match.group(2))
                    key = (file_path, line_num)
                    if key not in seen:
                        seen.add(key)
                        failures.append({
                            "file": file_path,
                            "line": line_num,
                            "error_context": match.group(0),
                            "raw_log": error_log,
                        })

        # Fallback: generic line-by-line scan
        if not failures:
            for i, line in enumerate(error_log.splitlines()):
                if any(kw in line for kw in ["Error:", "FAILED", "FAIL:", "error TS"]):
                    failures.append({
                        "file": "unknown",
                        "line": i + 1,
                        "error_context": line.strip(),
                        "raw_log": error_log,
                    })

        return failures[:10]  # Cap to 10 failures per iteration
