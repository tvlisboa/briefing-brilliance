import { BriefingData } from '@/types/briefing';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: BriefingData;
  onChange: (updates: Partial<BriefingData>) => void;
  errors: Record<string, string>;
}

const AGE_RANGES = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const GENDERS = ['Masculino', 'Feminino', 'Todos', 'Outro'];

export function StepAudience({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-lg font-semibold">Público-Alvo</h2>
        <p className="text-sm text-muted-foreground">Quem queremos atingir com essa peça?</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Faixa etária *</Label>
          <Select value={data.audienceAge} onValueChange={v => onChange({ audienceAge: v })}>
            <SelectTrigger className={errors.audienceAge ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {AGE_RANGES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.audienceAge && <p className="text-xs text-destructive mt-1">{errors.audienceAge}</p>}
        </div>

        <div>
          <Label>Gênero *</Label>
          <Select value={data.audienceGender} onValueChange={v => onChange({ audienceGender: v })}>
            <SelectTrigger className={errors.audienceGender ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.audienceGender && <p className="text-xs text-destructive mt-1">{errors.audienceGender}</p>}
        </div>

        <div>
          <Label htmlFor="audienceInterests">Interesses e comportamentos *</Label>
          <Textarea
            id="audienceInterests"
            placeholder="Ex: tecnologia, sustentabilidade, fitness, viagens..."
            value={data.audienceInterests}
            onChange={e => onChange({ audienceInterests: e.target.value })}
            className={`min-h-[80px] ${errors.audienceInterests ? 'border-destructive' : ''}`}
          />
          {errors.audienceInterests && <p className="text-xs text-destructive mt-1">{errors.audienceInterests}</p>}
        </div>

        <div>
          <Label htmlFor="audiencePainPoints">Dores / Necessidades</Label>
          <Textarea
            id="audiencePainPoints"
            placeholder="Quais problemas ou necessidades do público esta peça resolve?"
            value={data.audiencePainPoints}
            onChange={e => onChange({ audiencePainPoints: e.target.value })}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}
