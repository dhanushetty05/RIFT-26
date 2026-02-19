import { CheckCircle2, XCircle, GitCommit, Clock } from "lucide-react";
import type { TimelineEntry } from "@/types/agent";

interface Props {
  timeline: TimelineEntry[];
  totalIterations?: number;
}

export default function CICDTimeline({ timeline, totalIterations = 5 }: Props) {
  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 gradient-border animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-info-bg border border-primary/30 flex items-center justify-center">
          <GitCommit className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold font-mono text-foreground">CI/CD Timeline</h2>
          <p className="text-xs text-muted-foreground">Iteration-by-iteration execution log</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {timeline.map((entry, index) => {
            const isPassed = entry.status === "PASS";
            const isLast = index === timeline.length - 1;

            return (
              <div key={entry.iteration} className="relative flex items-start gap-4 pl-10">
                {/* Icon */}
                <div
                  className={`absolute left-0 w-9 h-9 rounded-full border-2 flex items-center justify-center z-10 ${
                    isPassed
                      ? "bg-success-bg border-success/50 shadow-glow-success"
                      : "bg-danger-bg border-danger/50 shadow-glow-danger"
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-danger" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-3 rounded-lg border ${
                    isPassed
                      ? "bg-success-bg border-success/20"
                      : "bg-danger-bg border-danger/20"
                  } ${isLast ? "" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-foreground">
                        Iteration {entry.iteration}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isPassed
                            ? "text-success border-success/30 bg-success/10"
                            : "text-danger border-danger/30 bg-danger/10"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>

                    {/* Retry counter */}
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <span>{entry.iteration}/{totalIterations}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: totalIterations }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < entry.iteration
                            ? isPassed && i === entry.iteration - 1
                              ? "bg-success"
                              : i < timeline.length - 1
                              ? "bg-danger/60"
                              : "bg-success"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-mono text-muted-foreground">
              {timeline.filter((t) => t.status === "PASS").length} passed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-danger" />
            <span className="text-xs font-mono text-muted-foreground">
              {timeline.filter((t) => t.status === "FAIL").length} failed
            </span>
          </div>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Max retries: {totalIterations}
        </span>
      </div>
    </div>
  );
}
