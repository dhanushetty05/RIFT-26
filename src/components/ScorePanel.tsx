import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { Trophy, Zap, Target, Award, Minus } from "lucide-react";
import type { Score } from "@/types/agent";

interface Props {
  score: Score;
  iterationsUsed: number;
}

export default function ScorePanel({ score, iterationsUsed }: Props) {
  const maxScore = 150;
  const percentage = Math.min(100, Math.round((score.final_score / maxScore) * 100));

  const chartData = [{ value: percentage }];

  const getScoreColor = () => {
    if (score.final_score >= 120) return "#22c55e"; // Excellent
    if (score.final_score >= 100) return "#3b82f6"; // Great
    if (score.final_score >= 80) return "#f59e0b";  // Good
    return "#ef4444"; // Needs Work
  };

  const getScoreLabel = () => {
    if (score.final_score >= 120) return "Excellent";
    if (score.final_score >= 100) return "Great";
    if (score.final_score >= 80) return "Good";
    return "Needs Work";
  };

  return (
    <div className="glass-card rounded-xl p-6 gradient-border animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-warning" />
        </div>
        <div>
          <h2 className="text-sm font-semibold font-mono text-foreground">Performance Score</h2>
          <p className="text-xs text-muted-foreground">Dynamic rating (max 150)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "hsl(222, 30%, 16%)" }}
                dataKey="value"
                cornerRadius={8}
                fill={getScoreColor()}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-mono" style={{ color: getScoreColor() }}>
              {score.final_score}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              {getScoreLabel()}
            </span>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="flex-1 w-full space-y-3">
          <ScoreRow
            icon={<span className="text-xs font-mono text-muted-foreground">BASE</span>}
            label="Base Score"
            value={score.base}
            positive
          />
          
          {score.speed_bonus > 0 && (
            <ScoreRow
              icon={<Zap className="w-3.5 h-3.5 text-success" />}
              label={`Speed Bonus (${score.breakdown?.time_formatted || 'fast'})`}
              value={score.speed_bonus}
              positive
            />
          )}
          
          {score.efficiency_bonus > 0 && (
            <ScoreRow
              icon={<Target className="w-3.5 h-3.5 text-blue-500" />}
              label={`Efficiency Bonus (${score.breakdown?.total_fixes || 0} fixes)`}
              value={score.efficiency_bonus}
              positive
            />
          )}
          
          {score.quality_bonus > 0 && (
            <ScoreRow
              icon={<Award className="w-3.5 h-3.5 text-purple-500" />}
              label="Quality Bonus"
              value={score.quality_bonus}
              positive
            />
          )}
          
          {score.efficiency_penalty > 0 && (
            <ScoreRow
              icon={<Minus className="w-3.5 h-3.5 text-danger" />}
              label="Efficiency Penalty"
              value={-score.efficiency_penalty}
              positive={false}
              isNegative
            />
          )}

          <div className="border-t border-border pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Final Score</span>
              <span
                className="text-xl font-bold font-mono"
                style={{ color: getScoreColor() }}
              >
                {score.final_score}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${percentage}%`,
                  background: getScoreColor(),
                  boxShadow: `0 0 8px ${getScoreColor()}80`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground font-mono">0</span>
              <span className="text-[10px] text-muted-foreground font-mono">{maxScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({
  icon,
  label,
  value,
  positive,
  isNegative,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  positive: boolean;
  isNegative?: boolean;
}) {
  const displayValue = isNegative ? value : value;
  const valueColor =
    isNegative && value < 0
      ? "text-danger"
      : positive && value > 0
      ? "text-success"
      : value === 0
      ? "text-muted-foreground"
      : "text-foreground";

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-background/40 border border-border/40">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-mono text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-bold font-mono ${valueColor}`}>
        {displayValue > 0 && !isNegative ? "+" : ""}
        {displayValue}
      </span>
    </div>
  );
}
