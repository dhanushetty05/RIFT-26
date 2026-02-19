"""
Commit Agent
============
Handles git staging, committing, and pushing.
"""

import subprocess
import os


class CommitAgent:
    """Commits fixed files with [AI-AGENT] prefix."""

    def __init__(self, repo_path: str):
        self.repo_path = repo_path
        self._configure_git()

    def _configure_git(self):
        """Set git identity for automated commits."""
        subprocess.run(
            ["git", "config", "user.email", "ci-healer@ai-agent.dev"],
            cwd=self.repo_path, capture_output=True
        )
        subprocess.run(
            ["git", "config", "user.name", "CI/CD Healing Agent"],
            cwd=self.repo_path, capture_output=True
        )

    def commit(self, message: str) -> bool:
        """Stage all changes and commit."""
        try:
            # Stage all changes
            result = subprocess.run(
                ["git", "add", "-A"],
                cwd=self.repo_path, capture_output=True
            )
            if result.returncode != 0:
                print(f"[Commit] git add failed: {result.stderr.decode()}")
                return False

            # Commit
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=self.repo_path, capture_output=True
            )
            if result.returncode != 0:
                stderr = result.stderr.decode()
                if "nothing to commit" in stderr:
                    print("[Commit] Nothing to commit")
                    return True
                print(f"[Commit] git commit failed: {stderr}")
                return False

            print(f"[Commit] ✓ {message}")
            return True
        except Exception as e:
            print(f"[Commit] Exception: {e}")
            return False
