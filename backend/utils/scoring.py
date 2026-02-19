"""
Scoring Utility
===============
Calculates the final score based on CI status, iterations, and speed.
"""


def calculate_score(
    ci_status: str,
    iterations_used: int,
    time_elapsed_seconds: float,
) -> dict:
    """
    Scoring formula:
    - Base: 100
    - Speed bonus: +10 if completed in < 5 minutes
    - Efficiency penalty: -2 per commit over 20
    - CI FAILED: final_score = 0
    """
    base = 100
    speed_bonus = 0
    efficiency_penalty = 0

    if ci_status != "PASSED":
        return {
            "base": base,
            "speed_bonus": 0,
            "efficiency_penalty": 0,
            "final_score": 0,
        }

    # Speed bonus: < 5 minutes
    if time_elapsed_seconds < 300:
        speed_bonus = 10

    # Efficiency penalty: -2 per commit over 20
    if iterations_used > 20:
        efficiency_penalty = (iterations_used - 20) * 2

    final_score = base + speed_bonus - efficiency_penalty
    final_score = max(0, final_score)

    return {
        "base": base,
        "speed_bonus": speed_bonus,
        "efficiency_penalty": efficiency_penalty,
        "final_score": final_score,
    }
