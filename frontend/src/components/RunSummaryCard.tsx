import { GitBranch, Link, AlertCircle, CheckCircle2, Clock, Bug, Wrench } from "lucide-react";
import type { AgentResult } from "@/types/agent";

interface Props {
  result: AgentResult;
}

export default function RunSummaryCard({ result }: Props) {
  const isPassed = result.ci_status === "PASSED";

  return (
    <div
      className={`rounded-xl p-6 border ${
        isPassed
          ? "bg-success-bg border-success/30 shadow-glow-success"
          : "bg-danger-bg border-danger/30 shadow-glow-danger"
      } animate-fade-in-up`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isPassed ? "bg-success/20 border border-success/30" : "bg-danger/20 border border-danger/30"
            }`}
          >
            {isPassed ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 text-danger" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold font-mono text-foreground">Run Summary</h2>
            <p className="text-xs text-muted-foreground">Agent pipeline results</p>
          </div>
        </div>

        {/* CI Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider ${
            isPassed
              ? "bg-success/10 border-success/40 text-success"
              : "bg-danger/10 border-danger/40 text-danger"
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isPassed ? "bg-success" : "bg-danger"} pulse-dot`} />
          {result.ci_status}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatItem
          icon={<Bug className="w-3.5 h-3.5" />}
          label="Total Failures"
          value={result.total_failures.toString()}
          color="danger"
        />
        <StatItem
          icon={<Wrench className="w-3.5 h-3.5" />}
          label="Total Fixes"
          value={result.total_fixes.toString()}
          color="success"
        />
        <StatItem
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Time Taken"
          value={result.time_taken}
          color="primary"
        />
        <StatItem
          icon={<AlertCircle className="w-3.5 h-3.5" />}
          label="Iterations"
          value={`${result.iterations_used}/5`}
          color="warning"
        />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <InfoRow
          icon={<Link className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
          label="Repo"
          value={result.repo_url}
          mono
          truncate
        />
        <InfoRow
          icon={<GitBranch className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
          label="Branch"
          value={result.branch_name}
          mono
          highlight
        />
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "success" | "danger" | "primary" | "warning";
}) {
  const colorMap = {
    success: "text-success",
    danger: "text-danger",
    primary: "text-primary",
    warning: "text-warning",
  };

  return (
    <div className="bg-background/40 rounded-lg p-3 border border-border/50">
      <div className={`flex items-center gap-1 mb-1 ${colorMap[color]}`}>{icon}</div>
      <div className={`text-lg font-bold font-mono ${colorMap[color]}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">{label}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
  highlight,
  truncate,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/30 border border-border/40">
      {icon}
      <span className="text-xs text-muted-foreground font-mono w-10 flex-shrink-0">{label}:</span>
      <span
        className={`text-xs flex-1 ${mono ? "font-mono" : ""} ${
          highlight ? "text-primary" : "text-foreground"
        } ${truncate ? "truncate" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
