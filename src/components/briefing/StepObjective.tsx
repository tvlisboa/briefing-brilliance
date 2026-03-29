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
        <h2 className="text-lg font-semibold">Objetivo Alvo</h2>
        <p className="text-sm text-muted-foreground">Defina o objetivo do projeto</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="objective">Objetivo Principal *</Label>
          <Textarea
            id="objective"
            placeholder="Descreva com clareza o que o objetivo espera comunicar e ou alcançar. Seja específico. Ex: 'Gerar 500 leads qualificados para o lançamento do produto X através de anúncios no Instagram Stories'"
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
          <Label htmlFor="expectedResults">Critérios de aceite *</Label>
          <Textarea
            id="expectedResults"
            placeholder="Defina os critérios de aceite para o projeto"
            value={data.expectedResults}
            onChange={e => onChange({ expectedResults: e.target.value })}
            className={`min-h-[80px] ${errors.expectedResults ? 'border-destructive' : ''}`}
          />
          {errors.expectedResults && <p className="text-xs text-destructive mt-1.5">{errors.expectedResults}</p>}
        </div>

        <div>
          <Label htmlFor="kpis">Objetivos & Resultados </Label>
          <Textarea
            id="kpis"
            placeholder="Conversão de clientes, novas campanhas e divulgação de marca"
            value={data.kpis}
            onChange={e => onChange({ kpis: e.target.value })}
            className="min-h-[60px] mb-1.5"
          />
        </div>
      </div>
    </div>
  );
}
