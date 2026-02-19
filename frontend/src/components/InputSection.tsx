import { useState } from "react";
import { Play, Loader2, GitBranch, Terminal, User, Link } from "lucide-react";
import { useAgent } from "@/context/AgentContext";

export default function InputSection() {
  const { request, setRequest, runAgent, isLoading } = useAgent();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!request.repo_url.trim()) errs.repo_url = "Repository URL is required";
    else if (!request.repo_url.startsWith("https://github.com/"))
      errs.repo_url = "Must be a valid GitHub URL (https://github.com/...)";
    if (!request.team_name.trim()) errs.team_name = "Team name is required";
    if (!request.leader_name.trim()) errs.leader_name = "Leader name is required";
    return errs;
  };

  const handleRun = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    await runAgent();
  };

  const branchPreview =
    request.team_name && request.leader_name
      ? `${request.team_name.toUpperCase().replace(/\s+/g, "_")}_${request.leader_name.toUpperCase().replace(/\s+/g, "_")}_AI_Fix`
      : null;

  return (
    <div className="glass-card rounded-xl p-6 gradient-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold font-mono text-foreground">Run Healing Agent</h2>
          <p className="text-xs text-muted-foreground">Configure and launch the autonomous CI/CD repair pipeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Repo URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
            <Link className="inline w-3 h-3 mr-1" />
            GitHub Repository URL
          </label>
          <input
            type="url"
            placeholder="https://github.com/owner/repository"
            value={request.repo_url}
            onChange={(e) => setRequest({ ...request, repo_url: e.target.value })}
            className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors ${
              errors.repo_url ? "border-danger/60" : "border-border"
            }`}
          />
          {errors.repo_url && (
            <p className="mt-1 text-xs text-danger font-mono">{errors.repo_url}</p>
          )}
        </div>

        {/* Team Name */}
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
            <User className="inline w-3 h-3 mr-1" />
            Team Name
          </label>
          <input
            type="text"
            placeholder="e.g. DevTeam"
            value={request.team_name}
            onChange={(e) => setRequest({ ...request, team_name: e.target.value })}
            className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors ${
              errors.team_name ? "border-danger/60" : "border-border"
            }`}
          />
          {errors.team_name && (
            <p className="mt-1 text-xs text-danger font-mono">{errors.team_name}</p>
          )}
        </div>

        {/* Leader Name */}
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
            <User className="inline w-3 h-3 mr-1" />
            Leader Name
          </label>
          <input
            type="text"
            placeholder="e.g. Alice"
            value={request.leader_name}
            onChange={(e) => setRequest({ ...request, leader_name: e.target.value })}
            className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors ${
              errors.leader_name ? "border-danger/60" : "border-border"
            }`}
          />
          {errors.leader_name && (
            <p className="mt-1 text-xs text-danger font-mono">{errors.leader_name}</p>
          )}
        </div>
      </div>

      {/* Branch preview */}
      {branchPreview && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-background/60 border border-border/50">
          <GitBranch className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground font-mono">Branch: </span>
          <span className="text-xs text-primary font-mono font-semibold">{branchPreview}</span>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold font-mono text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-glow-primary hover:shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Running Agent Pipeline...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Run Agent</span>
          </>
        )}
      </button>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            <span className="text-xs font-mono text-primary">Pipeline executing...</span>
          </div>
          <div className="space-y-1.5">
            {[
              "Cloning repository...",
              "Installing dependencies...",
              "Discovering test files...",
              "Running multi-agent analysis...",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-primary/50"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
                <span className="text-xs font-mono text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
