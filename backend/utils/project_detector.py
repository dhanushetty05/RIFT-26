"""
Project Type Detector
=====================
Detects Python vs Node.js projects and installs dependencies.
"""

import os
import subprocess
import glob
from typing import Optional


def detect_project_type(repo_path: str) -> str:
    """
    Returns 'python', 'node', or 'node_yarn' based on project files.
    """
    if os.path.exists(os.path.join(repo_path, "requirements.txt")):
        return "python"
    if os.path.exists(os.path.join(repo_path, "setup.py")):
        return "python"
    if os.path.exists(os.path.join(repo_path, "pyproject.toml")):
        return "python"
    if os.path.exists(os.path.join(repo_path, "yarn.lock")):
        return "node_yarn"
    if os.path.exists(os.path.join(repo_path, "package.json")):
        return "node"
    return "python"  # Default


def install_dependencies(repo_path: str, project_type: str) -> bool:
    """Install project dependencies."""
    print(f"[Deps] Installing {project_type} dependencies...")

    if project_type == "python":
        req_file = os.path.join(repo_path, "requirements.txt")
        if os.path.exists(req_file):
            result = subprocess.run(
                ["pip", "install", "-r", "requirements.txt", "--quiet"],
                cwd=repo_path, capture_output=True
            )
            return result.returncode == 0

        # Try setup.py
        setup_file = os.path.join(repo_path, "setup.py")
        if os.path.exists(setup_file):
            result = subprocess.run(
                ["pip", "install", "-e", ".", "--quiet"],
                cwd=repo_path, capture_output=True
            )
            return result.returncode == 0

    elif project_type in ("node", "node_yarn"):
        cmd = ["yarn", "install"] if project_type == "node_yarn" else ["npm", "install"]
        result = subprocess.run(cmd, cwd=repo_path, capture_output=True)
        return result.returncode == 0

    return True


def discover_test_files(repo_path: str, project_type: str) -> list[str]:
    """
    Auto-discover test files without hardcoding paths.
    """
    test_files = []

    if project_type == "python":
        # pytest conventions
        patterns = [
            "**/test_*.py",
            "**/*_test.py",
            "**/tests/*.py",
            "**/test/*.py",
        ]
        for pattern in patterns:
            found = glob.glob(os.path.join(repo_path, pattern), recursive=True)
            test_files.extend(found)

    elif project_type in ("node", "node_yarn"):
        patterns = [
            "**/*.test.js",
            "**/*.test.ts",
            "**/*.spec.js",
            "**/*.spec.ts",
            "**/tests/*.js",
            "**/tests/*.ts",
        ]
        for pattern in patterns:
            found = glob.glob(os.path.join(repo_path, pattern), recursive=True)
            test_files.extend(found)

    # Make paths relative to repo
    test_files = [
        os.path.relpath(f, repo_path) for f in test_files
        if "node_modules" not in f and ".venv" not in f and "__pycache__" not in f
    ]

    return list(set(test_files))
