import { useAgent } from "@/context/AgentContext";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import RunSummaryCard from "@/components/RunSummaryCard";
import ScorePanel from "@/components/ScorePanel";
import FixesTable from "@/components/FixesTable";
import CICDTimeline from "@/components/CICDTimeline";
import { RefreshCw, Download } from "lucide-react";

export default function Index() {
  const { result, resetResult, isLoading } = useAgent();

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-success/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
            <span className="text-xs font-mono text-primary">Autonomous Multi-Agent Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            CI/CD{" "}
            <span className="text-primary">Healing</span>{" "}
            Agent
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto font-mono">
            Autonomous pipeline that clones your repo, detects failures, classifies bugs, applies
            LLM-powered fixes, commits, and re-tests — all without human intervention.
          </p>
        </div>

        {/* Input always shown */}
        <div className="mb-8 stagger-children">
          <InputSection />
        </div>

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-6 stagger-children">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
                <span className="text-sm font-mono text-muted-foreground">Pipeline Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono text-foreground hover:bg-accent transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  results.json
                </button>
                <button
                  onClick={resetResult}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
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
            <details className="glass-card rounded-xl border border-border">
              <summary className="px-6 py-4 cursor-pointer text-xs font-mono text-muted-foreground hover:text-foreground transition-colors select-none">
                📄 View raw results.json
              </summary>
              <div className="px-6 pb-4">
                <pre className="text-[11px] font-mono text-success/80 bg-background rounded-lg p-4 overflow-x-auto border border-border/50">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Empty state */}
        {!result && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              Enter a GitHub repo URL and run the agent to see results
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            CI/CD Healing Agent · Autonomous Repair Pipeline · Built for Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
