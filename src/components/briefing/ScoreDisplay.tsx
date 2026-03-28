import { getScoreColor, getScoreLabel } from '@/lib/briefing-score';

interface ScoreDisplayProps {
  score: number;
  breakdown?: {
    objective: number;
    audience: number;
    references: number;
    creative: number;
    technical: number;
  };
  compact?: boolean;
}

export function ScoreDisplay({ score, breakdown, compact }: ScoreDisplayProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full border-[3px] flex items-center justify-center text-sm font-bold"
          style={{ borderColor: color, color }}>
          {score}
        </div>
      </div>
    );
  }

  const categories = breakdown ? [
    { label: 'Objetivo', value: breakdown.objective, max: 20 },
    { label: 'Público', value: breakdown.audience, max: 15 },
    { label: 'Referências', value: breakdown.references, max: 25 },
    { label: 'Criativo', value: breakdown.creative, max: 20 },
    { label: 'Técnico', value: breakdown.technical, max: 20 },
  ] : [];

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Score do Briefing</span>
        <span className="text-2xl font-bold" style={{ color }}>{score}/100</span>
      </div>

      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="score-bar h-3"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
        {score < 70 && (
          <span className="text-xs text-destructive">Mínimo: 70 para envio</span>
        )}
      </div>

      {breakdown && (
        <div className="space-y-2 pt-2 border-t border-border">
          {categories.map(cat => (
            <div key={cat.label} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-20">{cat.label}</span>
              <div className="flex-1 bg-muted rounded-full h-1.5">
                <div
                  className="score-bar h-1.5"
                  style={{
                    width: `${(cat.value / cat.max) * 100}%`,
                    backgroundColor: cat.value >= cat.max * 0.7
                      ? 'hsl(var(--score-high))'
                      : cat.value > 0
                        ? 'hsl(var(--score-medium))'
                        : 'hsl(var(--score-low))',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                {cat.value}/{cat.max}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
