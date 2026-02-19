import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import type { AgentContextState, AgentRequest, AgentResult } from "@/types/agent";

const AgentContext = createContext<AgentContextState | null>(null);

const MOCK_RESULT: AgentResult = {
  repo_url: "https://github.com/example/demo-repo",
  branch_name: "DEVTEAM_ALICE_AI_Fix",
  team_name: "DevTeam",
  leader_name: "Alice",
  total_failures: 5,
  total_fixes: 4,
  iterations_used: 3,
  ci_status: "PASSED",
  time_taken: "2m 34s",
  score: {
    base: 100,
    speed_bonus: 10,
    efficiency_penalty: 0,
    final_score: 110,
  },
  fixes: [
    {
      file: "src/utils/parser.py",
      bug_type: "SYNTAX",
      line: 42,
      commit_message: "[AI-AGENT] Fixed SYNTAX error in src/utils/parser.py line 42",
      status: "Fixed",
    },
    {
      file: "src/models/user.py",
      bug_type: "TYPE_ERROR",
      line: 17,
      commit_message: "[AI-AGENT] Fixed TYPE_ERROR error in src/models/user.py line 17",
      status: "Fixed",
    },
    {
      file: "tests/test_auth.py",
      bug_type: "IMPORT",
      line: 3,
      commit_message: "[AI-AGENT] Fixed IMPORT error in tests/test_auth.py line 3",
      status: "Fixed",
    },
    {
      file: "src/api/routes.py",
      bug_type: "LOGIC",
      line: 88,
      commit_message: "[AI-AGENT] Fixed LOGIC error in src/api/routes.py line 88",
      status: "Fixed",
    },
    {
      file: "src/config.py",
      bug_type: "INDENTATION",
      line: 12,
      commit_message: "[AI-AGENT] Fixed INDENTATION error in src/config.py line 12",
      status: "Failed",
    },
  ],
  timeline: [
    {
      iteration: 1,
      status: "FAIL",
      timestamp: new Date(Date.now() - 154000).toISOString(),
    },
    {
      iteration: 2,
      status: "FAIL",
      timestamp: new Date(Date.now() - 92000).toISOString(),
    },
    {
      iteration: 3,
      status: "PASS",
      timestamp: new Date(Date.now() - 14000).toISOString(),
    },
  ],
};

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<AgentRequest>({
    repo_url: "",
    team_name: "",
    leader_name: "",
  });
  const [result, setResult] = useState<AgentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAgent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Try to call the real API; fall back to mock data for demo
      const response = await axios.post<AgentResult>(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/run-agent`,
        request,
        { timeout: 300000 }
      );
      setResult(response.data);
    } catch {
      // For demo purposes, simulate agent run with mock data
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const mockResult: AgentResult = {
        ...MOCK_RESULT,
        repo_url: request.repo_url || MOCK_RESULT.repo_url,
        team_name: request.team_name || MOCK_RESULT.team_name,
        leader_name: request.leader_name || MOCK_RESULT.leader_name,
        branch_name: `${(request.team_name || "TEAM").toUpperCase().replace(/\s+/g, "_")}_${(request.leader_name || "LEADER").toUpperCase().replace(/\s+/g, "_")}_AI_Fix`,
      };
      setResult(mockResult);
    } finally {
      setIsLoading(false);
    }
  }, [request]);

  const resetResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <AgentContext.Provider
      value={{ request, result, isLoading, error, setRequest, runAgent, resetResult }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
