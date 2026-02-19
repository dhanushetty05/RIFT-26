import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Shield, GitBranch, CheckCircle2, Code2 } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg">CI/CD Healer</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="font-mono"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="font-mono"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9AE4CB]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#085078]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in-up">
              <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
              <span className="text-sm font-mono text-primary">Autonomous Multi-Agent System</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              Fix Your CI/CD Pipeline
              <br />
              <span className="text-primary">Automatically</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up">
              Autonomous AI agents that detect, classify, and fix test failures in your repository.
              No manual intervention required. Just push and let the agents handle the rest.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="font-mono w-full sm:w-auto"
              >
                Start Healing Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="font-mono w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-fade-in-up">
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground font-mono">Automated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground font-mono">AI Agents</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">&lt;5min</div>
                <div className="text-sm text-muted-foreground font-mono">Avg Fix Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-agent system handles the entire pipeline from detection to deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GitBranch,
                title: "Auto Clone & Detect",
                description: "Automatically clones your repo, detects project type, and installs dependencies",
              },
              {
                icon: Bot,
                title: "AI Classification",
                description: "Classifier agent identifies bug types: syntax, logic, imports, and more",
              },
              {
                icon: Code2,
                title: "LLM-Powered Fixes",
                description: "GPT-4 generates minimal, targeted code fixes for each detected issue",
              },
              {
                icon: CheckCircle2,
                title: "Auto Testing",
                description: "Executor agent re-runs tests after each fix to verify success",
              },
              {
                icon: Zap,
                title: "Smart Commits",
                description: "Commits fixes with [AI-AGENT] prefix to a new branch, never touches main",
              },
              {
                icon: Shield,
                title: "Safe & Isolated",
                description: "Runs in Docker containers with resource limits and security controls",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built With Modern Tech
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Production-ready stack with React, FastAPI, and OpenAI
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React 18", desc: "Frontend" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "FastAPI", desc: "Backend" },
              { name: "OpenAI GPT-4", desc: "AI Fixes" },
              { name: "Docker", desc: "Isolation" },
              { name: "GitPython", desc: "Git Ops" },
              { name: "TailwindCSS", desc: "Styling" },
              { name: "shadcn/ui", desc: "Components" },
            ].map((tech, index) => (
              <div
                key={index}
                className="glass-card rounded-lg border border-border p-4 text-center hover:border-primary/50 transition-all"
              >
                <div className="font-semibold text-foreground mb-1">{tech.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Heal Your Pipeline?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join developers who trust AI agents to fix their CI/CD failures automatically
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="font-mono"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">CI/CD Healer</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              © 2026 CI/CD Healing Agent · Built for Hackathon
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
