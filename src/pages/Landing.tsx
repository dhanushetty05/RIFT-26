import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Shield, GitBranch, CheckCircle2, Code2 } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient Glow Effects */}
      <div className="ambient-glow-teal" style={{ top: '10%', left: '20%' }} />
      <div className="ambient-glow-teal" style={{ bottom: '20%', right: '15%' }} />

      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-teal">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CI/CD Healer</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="btn-primary"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="gradient-overlay absolute inset-0" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary mb-6 animate-fade-in-up">
              <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
              <span className="text-sm font-medium text-white">Autonomous Multi-Agent System</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
              Fix Your CI/CD Pipeline
              <br />
              <span className="text-gradient">Automatically</span>
            </h1>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed">
              Autonomous AI agents that detect, classify, and fix test failures in your repository.
              No manual intervention required. Just push and let the agents handle the rest.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="btn-primary text-lg px-8 py-6 w-full sm:w-auto"
              >
                Start Healing Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-secondary text-lg px-8 py-6 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 animate-fade-in-up">
              <div className="glass-card p-6 hover-scale">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-white/70">Automated</div>
              </div>
              <div className="glass-card p-6 hover-scale">
                <div className="text-4xl font-bold text-primary mb-2">6</div>
                <div className="text-sm text-white/70">AI Agents</div>
              </div>
              <div className="glass-card p-6 hover-scale">
                <div className="text-4xl font-bold text-primary mb-2">&lt;5min</div>
                <div className="text-sm text-white/70">Avg Fix Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Our multi-agent system handles the entire pipeline from detection to deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
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
                className="glass-card p-8 border-glow hover-scale group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary flex items-center justify-center mb-6 group-hover:glow-teal smooth-transition">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="gradient-overlay absolute inset-0" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Heal Your Pipeline?
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Join developers who trust AI agents to fix their CI/CD failures automatically
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="btn-primary text-lg px-10 py-6 glow-teal-strong"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">CI/CD Healer</span>
            </div>
            <p className="text-sm text-white/60">
              © 2026 CI/CD Healing Agent · Built for Hackathon
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
