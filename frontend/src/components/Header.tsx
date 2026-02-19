import { GitBranch, Cpu, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-success border-2 border-background pulse-dot" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-mono text-foreground tracking-tight">
                CI/CD<span className="text-primary">Healer</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono">
                Autonomous Repair Agent
              </p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
              <span className="text-xs text-muted-foreground font-mono">Agent Online</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">Multi-Agent</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-primary/30 bg-primary/5">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-mono font-medium">v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
