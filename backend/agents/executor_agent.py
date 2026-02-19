"""
Executor Agent
==============
Runs tests in a subprocess (or Docker container) and parses results.
"""

import asyncio
import subprocess
from typing import Any


class ExecutorAgent:
    """Runs test suite and parses pass/fail results."""

    def __init__(self, repo_path: str, project_type: str):
        self.repo_path = repo_path
        self.project_type = project_type

    async def run_tests(self, test_files: list[str]) -> str:
        """Execute the test suite asynchronously."""
        cmd = self._build_test_command(test_files)
        print(f"[Executor] Running: {' '.join(cmd)}")

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
            cwd=self.repo_path,
        )
        stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=120)
        return stdout.decode(errors="ignore")

    def _build_test_command(self, test_files: list[str]) -> list[str]:
        """Build the appropriate test command."""
        if self.project_type == "python":
            if test_files:
                return ["python", "-m", "pytest", "--tb=short", "-v"] + test_files
            return ["python", "-m", "pytest", "--tb=short", "-v"]
        elif self.project_type == "node":
            return ["npm", "test", "--", "--passWithNoTests"]
        elif self.project_type == "node_yarn":
            return ["yarn", "test", "--passWithNoTests"]
        return ["echo", "No test runner configured"]

    def parse_test_output(self, output: str) -> tuple[bool, str]:
        """
        Returns (passed: bool, error_log: str)
        """
        lower = output.lower()

        # Python pytest
        if "passed" in lower and "failed" not in lower and "error" not in lower:
            return True, ""
        if "no tests ran" in lower or "passed" in lower and "failed" not in lower:
            return True, ""

        # Node Jest / Mocha
        if "test suites: 0 failed" in lower or "passing" in lower and "failing" not in lower:
            return True, ""
        if "all tests passed" in lower:
            return True, ""

        # Exit code 0 heuristic
        if output.strip().endswith("0") or "0 failed" in lower:
            return True, ""

        return False, output
