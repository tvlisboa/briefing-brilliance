import { BriefingData, TONES } from '@/types/briefing';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: BriefingData;
  onChange: (updates: Partial<BriefingData>) => void;
  errors: Record<string, string>;
}

export function StepCreativeDirection({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-lg font-semibold">Direção Criativa</h2>
        <p className="text-sm text-muted-foreground">Defina o tom visual e comunicativo</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Tom de comunicação *</Label>
          <Select value={data.tone} onValueChange={v => onChange({ tone: v })}>
            <SelectTrigger className={errors.tone ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione o tom" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.tone && <p className="text-xs text-destructive mt-1">{errors.tone}</p>}
        </div>

        <div>
          <Label htmlFor="visualStyle">Estilo visual *</Label>
          <Textarea
            id="visualStyle"
            placeholder="Descreva o estilo visual desejado. Ex: clean, moderno, com cores vibrantes e tipografia sans-serif"
            value={data.visualStyle}
            onChange={e => onChange({ visualStyle: e.target.value })}
            className={`min-h-[80px] ${errors.visualStyle ? 'border-destructive' : ''}`}
          />
          {errors.visualStyle && <p className="text-xs text-destructive mt-1">{errors.visualStyle}</p>}
        </div>

        <div>
          <Label htmlFor="keyMessage">Mensagem-chave *</Label>
          <Textarea
            id="keyMessage"
            placeholder="Qual é a mensagem principal que precisa ser comunicada?"
            value={data.keyMessage}
            onChange={e => onChange({ keyMessage: e.target.value })}
            className={`min-h-[80px] ${errors.keyMessage ? 'border-destructive' : ''}`}
          />
          {errors.keyMessage && <p className="text-xs text-destructive mt-1">{errors.keyMessage}</p>}
        </div>

        <div>
          <Label htmlFor="restrictions">Restrições ou diretrizes</Label>
          <Textarea
            id="restrictions"
            placeholder="Algo que NÃO pode ser usado? Cores proibidas, palavras, etc."
            value={data.restrictions}
            onChange={e => onChange({ restrictions: e.target.value })}
            className="min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
}
