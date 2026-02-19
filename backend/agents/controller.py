"""
Multi-Agent Controller
======================
Orchestrates all agents in the CI/CD healing pipeline.
Production-ready with comprehensive error handling.
"""

import os
import shutil
import tempfile
import subprocess
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
from utils.scoring import calculate_score
import time


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
        """Main pipeline execution with comprehensive error handling."""
        self.work_dir = tempfile.mkdtemp(prefix="ci_healer_")
        start_time = time.time()

        try:
            # PHASE 1: Clone repository
            print(f"[Pipeline] Cloning {self.repo_url} ...")
            try:
                repo_path = clone_repo(self.repo_url, self.work_dir, self.branch_name)
            except Exception as e:
                print(f"[Pipeline] Clone failed: {e}")
                return self._error_result(f"Failed to clone repository: {str(e)}")

            # PHASE 2: Detect project type
            try:
                project_type = detect_project_type(repo_path)
                print(f"[Pipeline] Detected: {project_type}")
            except Exception as e:
                print(f"[Pipeline] Detection failed: {e}")
                project_type = "python"  # Default fallback

            # PHASE 3: Install dependencies (non-blocking)
            try:
                install_dependencies(repo_path, project_type)
            except Exception as e:
                print(f"[Pipeline] Dependency installation failed (continuing): {e}")

            # PHASE 4: Discover test files
            try:
                test_files = discover_test_files(repo_path, project_type)
                print(f"[Pipeline] Found test files: {test_files}")
            except Exception as e:
                print(f"[Pipeline] Test discovery failed: {e}")
                test_files = []

            # Initialize agents
            analyzer = AnalyzerAgent()
            classifier = ClassifierAgent()
            fix_gen = FixGeneratorAgent()
            executor = ExecutorAgent(repo_path, project_type)
            commit_agent = CommitAgent(repo_path)
            tracker = CITrackerAgent()

            # PHASE 5: Execute pipeline
            if test_files:
                return await self._run_test_pipeline(
                    repo_path, test_files, analyzer, classifier, 
                    fix_gen, executor, commit_agent, tracker
                )
            else:
                return await self._run_static_analysis(
                    repo_path, project_type, analyzer, classifier, 
                    fix_gen, commit_agent
                )

        except Exception as e:
            print(f"[Pipeline] Unexpected error: {e}")
            import traceback
            traceback.print_exc()
            return self._error_result(f"Pipeline error: {str(e)}")
        finally:
            # Cleanup
            try:
                shutil.rmtree(self.work_dir, ignore_errors=True)
            except:
                pass

    async def _run_test_pipeline(self, repo_path, test_files, analyzer, 
                                  classifier, fix_gen, executor, commit_agent, tracker) -> dict:
        """Run the test-based healing pipeline."""
        for iteration in range(1, MAX_ITERATIONS + 1):
            timestamp = datetime.utcnow().isoformat()
            print(f"\n[Pipeline] ─── Iteration {iteration}/{MAX_ITERATIONS} ───")

            try:
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
                    
                    # Push fixes
                    if self.fixes:
                        try:
                            push_branch(repo_path, self.branch_name, self.repo_url)
                        except Exception as e:
                            print(f"[Pipeline] Push failed: {e}")
                    
                    # Calculate score
                    time_elapsed = time.time() - start_time
                    score = calculate_score(
                        "PASSED",
                        iteration,
                        time_elapsed,
                        self.total_failures,
                        self.total_fixes
                    )
                    
                    return {
                        "ci_status": "PASSED",
                        "total_failures": self.total_failures,
                        "total_fixes": self.total_fixes,
                        "iterations_used": iteration,
                        "fixes": self.fixes,
                        "timeline": self.timeline,
                        "score": score,
                        "time_elapsed": time_elapsed,
                    }

                # Tests failed
                self.timeline.append({
                    "iteration": iteration,
                    "status": "FAIL",
                    "timestamp": timestamp,
                })
                tracker.record(iteration, "FAIL")

                # Analyze failures
                failures = analyzer.analyze(error_log)
                print(f"[Pipeline] Found {len(failures)} failures")
                self.total_failures = max(self.total_failures, len(failures))

                if not failures:
                    print("[Pipeline] No failures detected, but tests failed")
                    break

                # Fix each failure
                for failure in failures:
                    try:
                        bug_type = classifier.classify(failure)
                        fix = await fix_gen.generate_fix(failure, bug_type, repo_path)

                        if fix:
                            applied = fix_gen.apply_fix(fix, repo_path)
                            commit_msg = f"[AI-AGENT] Fixed {bug_type} in {fix['file']} line {fix['line']}"

                            fix_record = {
                                "file": fix["file"],
                                "bug_type": bug_type,
                                "line": fix["line"],
                                "commit_message": commit_msg,
                                "status": "Fixed" if applied else "Failed",
                            }
                            self.fixes.append(fix_record)

                            if applied:
                                try:
                                    commit_agent.commit(commit_msg)
                                    self.total_fixes += 1
                                except Exception as e:
                                    print(f"[Pipeline] Commit failed: {e}")
                    except Exception as e:
                        print(f"[Pipeline] Fix error: {e}")
                        continue

            except Exception as e:
                print(f"[Pipeline] Iteration {iteration} error: {e}")
                continue

        # Max iterations reached
        print("[Pipeline] ✗ Max iterations reached. CI FAILED.")
        
        # Push whatever fixes we have
        if self.fixes:
            try:
                push_branch(repo_path, self.branch_name, self.repo_url)
            except Exception as e:
                print(f"[Pipeline] Push failed: {e}")
        
        # Calculate score (will be 0 for FAILED)
        time_elapsed = time.time() - start_time
        score = calculate_score(
            "FAILED",
            MAX_ITERATIONS,
            time_elapsed,
            self.total_failures,
            self.total_fixes
        )
        
        return {
            "ci_status": "FAILED",
            "total_failures": self.total_failures,
            "total_fixes": self.total_fixes,
            "iterations_used": MAX_ITERATIONS,
            "fixes": self.fixes,
            "timeline": self.timeline,
            "score": score,
            "time_elapsed": time_elapsed,
        }

    async def _run_static_analysis(self, repo_path, project_type, analyzer, 
                                     classifier, fix_gen, commit_agent) -> dict:
        """Run static code analysis when no tests are found."""
        print("[Pipeline] No tests found. Running static analysis...")
        
        issues_found = []
        
        # Try multiple analysis tools
        if project_type == "python":
            issues_found = await self._analyze_python(repo_path, analyzer)
        elif project_type in ("node", "node_yarn"):
            issues_found = await self._analyze_node(repo_path, analyzer)
        
        # Fallback: basic code scan
        if not issues_found:
            print("[Static] Running basic code scan...")
            issues_found = self._basic_code_scan(repo_path, project_type)
        
        print(f"[Static] Found {len(issues_found)} issues")
        self.total_failures = len(issues_found)
        
        # Fix issues
        for failure in issues_found[:5]:
            try:
                bug_type = classifier.classify(failure)
                fix = await fix_gen.generate_fix(failure, bug_type, repo_path)
                
                if fix:
                    applied = fix_gen.apply_fix(fix, repo_path)
                    commit_msg = f"[AI-AGENT] Fixed {bug_type} in {fix['file']} line {fix['line']}"
                    
                    fix_record = {
                        "file": fix["file"],
                        "bug_type": bug_type,
                        "line": fix["line"],
                        "commit_message": commit_msg,
                        "status": "Fixed" if applied else "Failed",
                    }
                    self.fixes.append(fix_record)
                    
                    if applied:
                        try:
                            commit_agent.commit(commit_msg)
                            self.total_fixes += 1
                        except Exception as e:
                            print(f"[Static] Commit failed: {e}")
            except Exception as e:
                print(f"[Static] Fix error: {e}")
                continue
        
        # Push fixes
        if self.fixes:
            try:
                push_branch(repo_path, self.branch_name, self.repo_url)
            except Exception as e:
                print(f"[Static] Push failed: {e}")
        
        status = "PASSED" if self.total_fixes > 0 else "NO_ISSUES"
        
        # Calculate score
        time_elapsed = time.time() - start_time
        score = calculate_score(
            status,
            1,
            time_elapsed,
            self.total_failures,
            self.total_fixes
        )
        
        return {
            "ci_status": status,
            "total_failures": self.total_failures,
            "total_fixes": self.total_fixes,
            "iterations_used": 1,
            "fixes": self.fixes,
            "timeline": [{
                "iteration": 1,
                "status": "PASS" if self.fixes else "NO_TESTS",
                "timestamp": datetime.utcnow().isoformat(),
            }],
            "score": score,
            "time_elapsed": time_elapsed,
        }

    async def _analyze_python(self, repo_path, analyzer) -> list:
        """Analyze Python code with multiple tools."""
        issues = []
        
        # Try flake8 first (faster)
        try:
            result = subprocess.run(
                ["python", "-m", "flake8", ".", "--exit-zero", "--max-line-length=120"],
                cwd=repo_path,
                capture_output=True,
                timeout=60,
                text=True
            )
            if result.stdout and len(result.stdout) > 50:
                print("[Static] flake8 found issues")
                issues = analyzer.analyze(result.stdout)
                return issues
        except:
            pass
        
        # Try pylint
        try:
            result = subprocess.run(
                ["python", "-m", "pylint", ".", "--output-format=text", "--exit-zero"],
                cwd=repo_path,
                capture_output=True,
                timeout=60,
                text=True
            )
            if result.stdout and len(result.stdout) > 50:
                print("[Static] pylint found issues")
                issues = analyzer.analyze(result.stdout)
                return issues
        except:
            pass
        
        return issues

    async def _analyze_node(self, repo_path, analyzer) -> list:
        """Analyze Node.js code with multiple tools."""
        issues = []
        
        # Try ESLint first
        try:
            result = subprocess.run(
                ["npx", "eslint", ".", "--format=compact", "--no-error-on-unmatched-pattern"],
                cwd=repo_path,
                capture_output=True,
                timeout=60,
                text=True
            )
            if result.stdout and len(result.stdout) > 50:
                print("[Static] ESLint found issues")
                issues = analyzer.analyze(result.stdout)
                return issues
        except FileNotFoundError:
            print("[Static] ESLint not available, trying TypeScript compiler...")
        except Exception as e:
            print(f"[Static] ESLint error: {e}")
        
        # Try TypeScript compiler
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit", "--pretty", "false"],
                cwd=repo_path,
                capture_output=True,
                timeout=60,
                text=True
            )
            if result.stdout and len(result.stdout) > 50:
                print("[Static] TypeScript compiler found issues")
                issues = analyzer.analyze(result.stdout)
                return issues
        except Exception as e:
            print(f"[Static] TypeScript check error: {e}")
        
        # Try running npm test in check mode
        try:
            result = subprocess.run(
                ["npm", "run", "lint"],
                cwd=repo_path,
                capture_output=True,
                timeout=60,
                text=True
            )
            if result.stdout and len(result.stdout) > 50:
                print("[Static] npm lint found issues")
                issues = analyzer.analyze(result.stdout)
                return issues
        except Exception as e:
            print(f"[Static] npm lint error: {e}")
        
        return issues

    def _basic_code_scan(self, repo_path, project_type) -> list:
        """Basic code scanning without external tools."""
        issues = []
        
        if project_type == "python":
            for root, dirs, files in os.walk(repo_path):
                dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', '.venv', 'venv', 'node_modules']]
                
                for file in files:
                    if file.endswith('.py'):
                        filepath = os.path.join(root, file)
                        try:
                            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                                lines = f.readlines()
                                for i, line in enumerate(lines, 1):
                                    # Trailing whitespace
                                    if line.rstrip() != line.rstrip('\n'):
                                        issues.append({
                                            "file": os.path.relpath(filepath, repo_path),
                                            "line": i,
                                            "error_context": f"Trailing whitespace",
                                            "raw_log": "LINTING: Trailing whitespace"
                                        })
                                        break
                        except:
                            pass
                        
                        if len(issues) >= 10:
                            break
                if len(issues) >= 10:
                    break
        
        elif project_type in ("node", "node_yarn"):
            for root, dirs, files in os.walk(repo_path):
                dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', 'build', '.next']]
                
                for file in files:
                    if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                        filepath = os.path.join(root, file)
                        try:
                            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()
                                lines = content.splitlines()
                                
                                for i, line in enumerate(lines, 1):
                                    # Check for common issues
                                    # Unused variables (var keyword)
                                    if 'var ' in line and not line.strip().startswith('//'):
                                        issues.append({
                                            "file": os.path.relpath(filepath, repo_path),
                                            "line": i,
                                            "error_context": "Use 'let' or 'const' instead of 'var'",
                                            "raw_log": "LINTING: var keyword usage"
                                        })
                                        break
                                    
                                    # Console.log statements
                                    if 'console.log' in line and not line.strip().startswith('//'):
                                        issues.append({
                                            "file": os.path.relpath(filepath, repo_path),
                                            "line": i,
                                            "error_context": "Remove console.log statement",
                                            "raw_log": "LINTING: console.log found"
                                        })
                                        break
                                    
                                    # Trailing whitespace
                                    if line.endswith(' ') or line.endswith('\t'):
                                        issues.append({
                                            "file": os.path.relpath(filepath, repo_path),
                                            "line": i,
                                            "error_context": "Trailing whitespace",
                                            "raw_log": "LINTING: Trailing whitespace"
                                        })
                                        break
                        except:
                            pass
                        
                        if len(issues) >= 10:
                            break
                if len(issues) >= 10:
                    break
        
        return issues

    def _error_result(self, error_msg: str) -> dict:
        """Return error result structure."""
        return {
            "ci_status": "ERROR",
            "total_failures": 0,
            "total_fixes": 0,
            "iterations_used": 0,
            "fixes": [],
            "timeline": [],
            "error": error_msg,
        }
