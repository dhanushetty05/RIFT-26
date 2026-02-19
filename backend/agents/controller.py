"""
Multi-Agent Controller
======================
Orchestrates all agents in the CI/CD healing pipeline.
Uses an async event loop with max 5 retry iterations.
"""

import asyncio
import subprocess
import os
import shutil
import tempfile
from datetime import datetime
from typing import Any

from .analyzer_agent import AnalyzerAgent
from .classifier_agent import ClassifierAgent
from .fix_generator_agent import FixGeneratorAgent
from .executor_agent import ExecutorAgent
from .commit_agent import CommitAgent
from .ci_tracker_agent import CITrackerAgent
from utils.git_helper import clone_repo, push_branch
from utils.project_detector import detect_project_type, install_dependencies, discover_test_files


MAX_ITERATIONS = 5


class AgentController:
    def __init__(self, repo_url: str, branch_name: str, team_name: str, leader_name: str):
        self.repo_url = repo_url
        self.branch_name = branch_name
        self.team_name = team_name
        self.leader_name = leader_name
        self.work_dir: str = ""
        self.fixes: list = []
        self.timeline: list = []
        self.total_failures = 0
        self.total_fixes = 0

    async def run(self) -> dict[str, Any]:
        """Main pipeline execution."""
        # Create temp workspace
        self.work_dir = tempfile.mkdtemp(prefix="ci_healer_")

        try:
            # Step 1: Clone repo
            print(f"[Pipeline] Cloning {self.repo_url} ...")
            repo_path = clone_repo(self.repo_url, self.work_dir, self.branch_name)

            # Step 2: Detect project type and install deps
            project_type = detect_project_type(repo_path)
            print(f"[Pipeline] Detected: {project_type}")
            install_dependencies(repo_path, project_type)

            # Step 3: Discover test files
            test_files = discover_test_files(repo_path, project_type)
            print(f"[Pipeline] Found test files: {test_files}")

            # Initialize agents
            analyzer = AnalyzerAgent()
            classifier = ClassifierAgent()
            fix_gen = FixGeneratorAgent()
            executor = ExecutorAgent(repo_path, project_type)
            commit_agent = CommitAgent(repo_path)
            tracker = CITrackerAgent()

            # Step 4: Run test → fix loop
            for iteration in range(1, MAX_ITERATIONS + 1):
                timestamp = datetime.utcnow().isoformat()
                print(f"\n[Pipeline] ─── Iteration {iteration}/{MAX_ITERATIONS} ───")

                # Run tests
                test_output = await executor.run_tests(test_files)
                passed, error_log = executor.parse_test_output(test_output)

                if passed:
                    print("[Pipeline] ✓ All tests PASSED!")
                    self.timeline.append({
                        "iteration": iteration,
                        "status": "PASS",
                        "timestamp": timestamp,
                    })
                    tracker.record(iteration, "PASS")
                    break

                # Tests failed
                self.timeline.append({
                    "iteration": iteration,
                    "status": "FAIL",
                    "timestamp": timestamp,
                })
                tracker.record(iteration, "FAIL")

                # Analyze failures
                failures = analyzer.analyze(error_log)
                self.total_failures = max(self.total_failures, len(failures))

                # Classify + fix each failure
                for failure in failures:
                    bug_type = classifier.classify(failure)
                    fix = await fix_gen.generate_fix(failure, bug_type, repo_path)

                    if fix:
                        applied = fix_gen.apply_fix(fix, repo_path)
                        commit_msg = f"[AI-AGENT] Fixed {bug_type} error in {fix['file']} line {fix['line']}"

                        fix_record = {
                            "file": fix["file"],
                            "bug_type": bug_type,
                            "line": fix["line"],
                            "commit_message": commit_msg,
                            "status": "Fixed" if applied else "Failed",
                        }
                        self.fixes.append(fix_record)

                        if applied:
                            commit_agent.commit(commit_msg)
                            self.total_fixes += 1
            else:
                # Max iterations reached
                print("[Pipeline] ✗ Max iterations reached. CI FAILED.")
                # Push whatever fixes we have
                push_branch(repo_path, self.branch_name)
                return {
                    "ci_status": "FAILED",
                    "total_failures": self.total_failures,
                    "total_fixes": self.total_fixes,
                    "iterations_used": MAX_ITERATIONS,
                    "fixes": self.fixes,
                    "timeline": self.timeline,
                }

            # Push the fixed branch
            push_branch(repo_path, self.branch_name)

            return {
                "ci_status": "PASSED",
                "total_failures": self.total_failures,
                "total_fixes": self.total_fixes,
                "iterations_used": len(self.timeline),
                "fixes": self.fixes,
                "timeline": self.timeline,
            }

        finally:
            # Cleanup temp dir
            shutil.rmtree(self.work_dir, ignore_errors=True)
