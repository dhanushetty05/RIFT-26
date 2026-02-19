"""
Git Helper Utilities
====================
Cloning repositories and pushing branches using GitPython.
"""

import os
import subprocess
from typing import Optional


def clone_repo(repo_url: str, work_dir: str, branch_name: str) -> str:
    """
    Clone the repository into work_dir and create a new branch.
    Returns the path to the cloned repo.
    """
    repo_path = os.path.join(work_dir, "repo")

    # Clone (shallow for speed)
    result = subprocess.run(
        ["git", "clone", "--depth=50", repo_url, repo_path],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"git clone failed: {result.stderr}")

    # Create and checkout new branch
    result = subprocess.run(
        ["git", "checkout", "-b", branch_name],
        cwd=repo_path, capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"git checkout failed: {result.stderr}")

    print(f"[Git] Cloned to {repo_path}, branch: {branch_name}")
    return repo_path


def push_branch(repo_path: str, branch_name: str) -> bool:
    """Push the branch to origin."""
    result = subprocess.run(
        ["git", "push", "-u", "origin", branch_name],
        cwd=repo_path, capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"[Git] Push warning: {result.stderr}")
        return False
    print(f"[Git] ✓ Pushed branch: {branch_name}")
    return True


def get_current_commit(repo_path: str) -> Optional[str]:
    """Return the current HEAD commit SHA."""
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=repo_path, capture_output=True, text=True
    )
    return result.stdout.strip() if result.returncode == 0 else None
