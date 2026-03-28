import { BriefingData, GENERIC_OBJECTIVES } from '@/types/briefing';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface Props {
  data: BriefingData;
  onChange: (updates: Partial<BriefingData>) => void;
  errors: Record<string, string>;
}

export function StepObjective({ data, onChange, errors }: Props) {
  const isGeneric = GENERIC_OBJECTIVES.some(g =>
    data.objective.toLowerCase().trim() === g
  );

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-lg font-semibold">Objetivo da Peça</h2>
        <p className="text-sm text-muted-foreground">Defina claramente o que se espera alcançar</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="objective">Objetivo principal *</Label>
          <Textarea
            id="objective"
            placeholder="Descreva com clareza o que essa peça precisa comunicar e alcançar. Seja específico. Ex: 'Gerar 500 leads qualificados para o lançamento do produto X através de anúncios no Instagram Stories'"
            value={data.objective}
            onChange={e => onChange({ objective: e.target.value })}
            className={`min-h-[100px] ${errors.objective ? 'border-destructive' : ''}`}
          />
          <div className="flex items-center justify-between mt-1">
            <div>
              {errors.objective && <p className="text-xs text-destructive">{errors.objective}</p>}
              {isGeneric && data.objective.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <AlertCircle className="w-3 h-3" />
                  Objetivo genérico. Seja mais específico.
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{data.objective.length}/30 min</span>
          </div>
        </div>

        <div>
          <Label htmlFor="expectedResults">Resultados esperados *</Label>
          <Textarea
            id="expectedResults"
            placeholder="O que define sucesso para esse projeto?"
            value={data.expectedResults}
            onChange={e => onChange({ expectedResults: e.target.value })}
            className={`min-h-[80px] ${errors.expectedResults ? 'border-destructive' : ''}`}
          />
          {errors.expectedResults && <p className="text-xs text-destructive mt-1">{errors.expectedResults}</p>}
        </div>

        <div>
          <Label htmlFor="kpis">KPIs / Métricas</Label>
          <Textarea
            id="kpis"
            placeholder="Ex: CTR > 2%, 1000 cliques, 50 conversões"
            value={data.kpis}
            onChange={e => onChange({ kpis: e.target.value })}
            className="min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
}
