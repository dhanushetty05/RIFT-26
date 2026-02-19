import { useAgent } from "@/context/AgentContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputSection from "@/components/InputSection";
import RunSummaryCard from "@/components/RunSummaryCard";
import ScorePanel from "@/components/ScorePanel";
import FixesTable from "@/components/FixesTable";
import CICDTimeline from "@/components/CICDTimeline";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, LogOut, User, Bot } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { result, resetResult, isLoading } = useAgent();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results downloaded!");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient Glow Effects */}
      <div className="ambient-glow-teal" style={{ top: '15%', left: '5%' }} />
      <div className="ambient-glow-teal" style={{ bottom: '25%', right: '10%' }} />

      {/* Top Navigation */}
      <nav className="relative border-b border-border backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-teal">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CI/CD Healer</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm text-white">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-primary/10 smooth-transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary mb-6">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            <span className="text-sm font-medium text-white">Autonomous Multi-Agent Pipeline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            CI/CD{" "}
            <span className="text-gradient">Healing</span>{" "}
            Agent
          </h1>
          <p className="text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Autonomous pipeline that clones your repo, detects failures, classifies bugs, applies
            LLM-powered fixes, commits, and re-tests — all without human intervention.
          </p>
        </div>

        {/* Input always shown */}
        <div className="mb-10 stagger-children">
          <InputSection />
        </div>

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-8 stagger-children">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
                <span className="text-sm text-white/70">Pipeline Complete</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm text-white hover-scale smooth-transition"
                >
                  <Download className="w-4 h-4" />
                  results.json
                </button>
                <button
                  onClick={resetResult}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm text-white/70 hover:text-white hover-scale smooth-transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Summary + Score row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RunSummaryCard result={result} />
              <ScorePanel score={result.score} iterationsUsed={result.iterations_used} />
            </div>

            {/* Fixes table */}
            <FixesTable fixes={result.fixes} />

            {/* Timeline */}
            <CICDTimeline
              timeline={result.timeline}
              totalIterations={5}
            />

            {/* Raw JSON */}
            <details className="glass-card p-6">
              <summary className="cursor-pointer text-sm text-white/70 hover:text-white smooth-transition select-none">
                📄 View raw results.json
              </summary>
              <div className="mt-4">
                <pre className="text-xs text-primary/80 bg-input rounded-lg p-4 overflow-x-auto border border-primary/30">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Empty state */}
        {!result && !isLoading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6 glow-teal">
              <span className="text-4xl">🤖</span>
            </div>
            <p className="text-base text-white/70">
              Enter a GitHub repo URL and run the agent to see results
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-white/50">
            CI/CD Healing Agent · Autonomous Repair Pipeline · Built for Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
