export type BugType =
  | "LINTING"
  | "SYNTAX"
  | "LOGIC"
  | "TYPE_ERROR"
  | "IMPORT"
  | "INDENTATION";

export type CIStatus = "PASSED" | "FAILED" | "RUNNING";

export type FixStatus = "Fixed" | "Failed";

export interface Fix {
  file: string;
  bug_type: BugType;
  line: number;
  commit_message: string;
  status: FixStatus;
}

export interface TimelineEntry {
  iteration: number;
  status: "PASS" | "FAIL";
  timestamp: string;
}

export interface Score {
  base: number;
  speed_bonus: number;
  efficiency_bonus: number;
  quality_bonus: number;
  efficiency_penalty: number;
  final_score: number;
  breakdown?: {
    time_seconds?: number;
    time_formatted?: string;
    total_failures?: number;
    total_fixes?: number;
    fix_rate?: string;
    iterations?: number;
    reason?: string;
  };
}

export interface AgentResult {
  repo_url: string;
  branch_name: string;
  team_name: string;
  leader_name: string;
  total_failures: number;
  total_fixes: number;
  iterations_used: number;
  ci_status: CIStatus;
  time_taken: string;
  score: Score;
  fixes: Fix[];
  timeline: TimelineEntry[];
}

export interface AgentRequest {
  repo_url: string;
  team_name: string;
  leader_name: string;
}

export interface AgentContextState {
  request: AgentRequest;
  result: AgentResult | null;
  isLoading: boolean;
  error: string | null;
  setRequest: (req: AgentRequest) => void;
  runAgent: () => Promise<void>;
  resetResult: () => void;
}
