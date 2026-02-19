"""
Scoring Utility
===============
Calculates dynamic performance score based on multiple factors.
"""


def calculate_score(
    ci_status: str,
    iterations_used: int,
    time_elapsed_seconds: float,
    total_failures: int = 0,
    total_fixes: int = 0,
) -> dict:
    """
    Dynamic scoring formula with multiple bonuses and penalties.
    
    Base Score: 100 points
    
    Speed Bonuses (tiered):
      - < 2 minutes: +20 points
      - < 5 minutes: +15 points
      - < 10 minutes: +10 points
      - < 15 minutes: +5 points
    
    Efficiency Bonuses:
      - ≤ 5 fixes: +10 points
      - ≤ 10 fixes: +5 points
      - ≤ 15 fixes: +3 points
    
    Quality Bonus:
      - All fixes successful: +10 points
    
    Efficiency Penalty:
      - -2 points per fix over 15
    
    Maximum Score: 150 points
    Minimum Score: 0 points (if CI fails)
    """
    base = 100
    speed_bonus = 0
    efficiency_bonus = 0
    quality_bonus = 0
    efficiency_penalty = 0

    # If CI failed, score is 0
    if ci_status == "FAILED":
        return {
            "base": base,
            "speed_bonus": 0,
            "efficiency_bonus": 0,
            "quality_bonus": 0,
            "efficiency_penalty": 0,
            "final_score": 0,
            "breakdown": {
                "reason": "CI Failed - No score awarded"
            }
        }
    
    # If no issues found
    if ci_status == "NO_ISSUES":
        return {
            "base": base,
            "speed_bonus": 20,
            "efficiency_bonus": 10,
            "quality_bonus": 10,
            "efficiency_penalty": 0,
            "final_score": 140,
            "breakdown": {
                "reason": "No issues found - Excellent code quality"
            }
        }

    # Speed bonus (tiered)
    if time_elapsed_seconds < 120:  # < 2 minutes
        speed_bonus = 20
    elif time_elapsed_seconds < 300:  # < 5 minutes
        speed_bonus = 15
    elif time_elapsed_seconds < 600:  # < 10 minutes
        speed_bonus = 10
    elif time_elapsed_seconds < 900:  # < 15 minutes
        speed_bonus = 5

    # Efficiency bonus (based on number of fixes)
    if total_fixes <= 5:
        efficiency_bonus = 10
    elif total_fixes <= 10:
        efficiency_bonus = 5
    elif total_fixes <= 15:
        efficiency_bonus = 3

    # Quality bonus (all fixes successful)
    if total_fixes > 0 and total_fixes == total_failures:
        quality_bonus = 10
    elif total_fixes > 0 and total_fixes >= total_failures * 0.8:
        quality_bonus = 5

    # Efficiency penalty (too many fixes)
    if total_fixes > 15:
        efficiency_penalty = (total_fixes - 15) * 2

    # Calculate final score
    final_score = base + speed_bonus + efficiency_bonus + quality_bonus - efficiency_penalty
    final_score = max(0, min(150, final_score))  # Cap between 0 and 150

    return {
        "base": base,
        "speed_bonus": speed_bonus,
        "efficiency_bonus": efficiency_bonus,
        "quality_bonus": quality_bonus,
        "efficiency_penalty": efficiency_penalty,
        "final_score": final_score,
        "breakdown": {
            "time_seconds": round(time_elapsed_seconds, 2),
            "time_formatted": format_time(time_elapsed_seconds),
            "total_failures": total_failures,
            "total_fixes": total_fixes,
            "fix_rate": f"{(total_fixes / total_failures * 100) if total_failures > 0 else 0:.1f}%",
            "iterations": iterations_used,
        }
    }


def format_time(seconds: float) -> str:
    """Format seconds into human-readable time."""
    if seconds < 60:
        return f"{int(seconds)}s"
    elif seconds < 3600:
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes}m {secs}s"
    else:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return f"{hours}h {minutes}m"
