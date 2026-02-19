import { CheckCircle2, XCircle, FileCode2, Hash } from "lucide-react";
import type { Fix, BugType } from "@/types/agent";

interface Props {
  fixes: Fix[];
}

const BUG_TYPE_COLORS: Record<BugType, { bg: string; text: string; border: string }> = {
  LINTING: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  SYNTAX: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  LOGIC: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  TYPE_ERROR: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  IMPORT: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  INDENTATION: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/30",
  },
};

export default function FixesTable({ fixes }: Props) {
  return (
    <div className="glass-card rounded-xl p-6 gradient-border animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent border border-border flex items-center justify-center">
            <FileCode2 className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold font-mono text-foreground">Fixes Applied</h2>
            <p className="text-xs text-muted-foreground">{fixes.length} issues detected</p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <span className="text-xs text-muted-foreground font-mono">Fixed</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-danger" />
            <span className="text-xs text-muted-foreground font-mono">Failed</span>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider pr-4">File</th>
              <th className="pb-3 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider pr-4">Bug Type</th>
              <th className="pb-3 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider pr-4">
                <Hash className="inline w-3 h-3 mr-0.5" />
                Line
              </th>
              <th className="pb-3 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider pr-4">Commit Message</th>
              <th className="pb-3 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {fixes.map((fix, index) => {
              const bugColors = BUG_TYPE_COLORS[fix.bug_type];
              const isFixed = fix.status === "Fixed";
              return (
                <tr
                  key={index}
                  className={`transition-colors hover:bg-secondary/30 ${
                    isFixed ? "" : "opacity-80"
                  }`}
                >
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-foreground/90 truncate max-w-[180px] block">
                      {fix.file}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${bugColors.bg} ${bugColors.text} ${bugColors.border}`}
                    >
                      {fix.bug_type}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-muted-foreground">{fix.line}</span>
                  </td>
                  <td className="py-3 pr-4 max-w-xs">
                    <span className="text-xs font-mono text-muted-foreground truncate block">
                      {fix.commit_message}
                    </span>
                  </td>
                  <td className="py-3">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${
                        isFixed
                          ? "bg-success-bg border-success/30 text-success"
                          : "bg-danger-bg border-danger/30 text-danger"
                      }`}
                    >
                      {isFixed ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <XCircle className="w-2.5 h-2.5" />
                      )}
                      {fix.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {fixes.map((fix, index) => {
          const bugColors = BUG_TYPE_COLORS[fix.bug_type];
          const isFixed = fix.status === "Fixed";
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                isFixed ? "border-success/20 bg-success-bg" : "border-danger/20 bg-danger-bg"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-foreground font-medium truncate flex-1 mr-2">
                  {fix.file}
                </span>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold flex-shrink-0 ${
                    isFixed
                      ? "bg-success/10 border-success/30 text-success"
                      : "bg-danger/10 border-danger/30 text-danger"
                  }`}
                >
                  {isFixed ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                  {fix.status}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border ${bugColors.bg} ${bugColors.text} ${bugColors.border}`}
                >
                  {fix.bug_type}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Line {fix.line}</span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground truncate">{fix.commit_message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
