"""
CI Tracker Agent
================
Tracks iteration history and convergence status.
"""

from datetime import datetime
from typing import Any


class CITrackerAgent:
    """Records and summarizes iteration results."""

    def __init__(self):
        self.history: list[dict[str, Any]] = []

    def record(self, iteration: int, status: str) -> None:
        self.history.append({
            "iteration": iteration,
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
        })
        print(f"[Tracker] Iteration {iteration}: {status}")

    def converged(self) -> bool:
        """Returns True if the last status was PASS."""
        return bool(self.history) and self.history[-1]["status"] == "PASS"

    def summary(self) -> dict[str, Any]:
        return {
            "total_iterations": len(self.history),
            "converged": self.converged(),
            "history": self.history,
        }
