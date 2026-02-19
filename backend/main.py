"""
Autonomous CI/CD Healing Agent - FastAPI Backend
================================================
Entry point for the multi-agent repair pipeline.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
import json
import os
import time
from datetime import datetime
from typing import Optional

from agents.controller import AgentController
from utils.scoring import calculate_score

app = FastAPI(
    title="CI/CD Healing Agent API",
    description="Autonomous multi-agent pipeline for detecting and fixing CI/CD failures",
    version="1.0.0",
)

# Allow all origins for hackathon demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentRequest(BaseModel):
    repo_url: str
    team_name: str
    leader_name: str


class AgentResponse(BaseModel):
    repo_url: str
    branch_name: str
    team_name: str
    leader_name: str
    total_failures: int
    total_fixes: int
    iterations_used: int
    ci_status: str
    time_taken: str
    score: dict
    fixes: list
    timeline: list


@app.get("/health")
async def health_check():
    return {"status": "ok", "agent": "online", "timestamp": datetime.utcnow().isoformat()}


@app.post("/run-agent", response_model=AgentResponse)
async def run_agent(request: AgentRequest):
    """
    Main endpoint: Runs the autonomous CI/CD healing pipeline.
    
    1. Creates branch (TEAMNAME_LEADERNAME_AI_Fix)
    2. Clones repo into Docker sandbox
    3. Installs deps (Python / Node auto-detection)
    4. Discovers and runs tests
    5. Multi-agent analysis + fix loop (max 5 retries)
    6. Commits all fixes with [AI-AGENT] prefix
    7. Returns structured results.json
    """
    if not request.repo_url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Only GitHub repositories are supported")

    # Create branch name: TEAMNAME_LEADERNAME_AI_Fix
    branch_name = (
        f"{request.team_name.upper().replace(' ', '_')}_"
        f"{request.leader_name.upper().replace(' ', '_')}_AI_Fix"
    )

    start_time = time.time()

    controller = AgentController(
        repo_url=request.repo_url,
        branch_name=branch_name,
        team_name=request.team_name,
        leader_name=request.leader_name,
    )

    try:
        result = await controller.run()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent pipeline failed: {str(e)}")

    elapsed = time.time() - start_time
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    time_taken = f"{minutes}m {seconds}s"

    score = calculate_score(
        ci_status=result["ci_status"],
        iterations_used=result["iterations_used"],
        time_elapsed_seconds=elapsed,
    )

    response = {
        "repo_url": request.repo_url,
        "branch_name": branch_name,
        "team_name": request.team_name,
        "leader_name": request.leader_name,
        "total_failures": result["total_failures"],
        "total_fixes": result["total_fixes"],
        "iterations_used": result["iterations_used"],
        "ci_status": result["ci_status"],
        "time_taken": time_taken,
        "score": score,
        "fixes": result["fixes"],
        "timeline": result["timeline"],
    }

    # Save results.json
    with open("results.json", "w") as f:
        json.dump(response, f, indent=2)

    return response


@app.get("/results")
async def get_results():
    """Return the latest results.json"""
    if not os.path.exists("results.json"):
        raise HTTPException(status_code=404, detail="No results yet")
    return FileResponse("results.json", media_type="application/json")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
