import { BriefingData, PLATFORMS } from '@/types/briefing';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: BriefingData;
  onChange: (updates: Partial<BriefingData>) => void;
  errors: Record<string, string>;
}

const FORMATS = ['Imagem estática', 'Carrossel', 'Vídeo', 'GIF', 'Stories', 'Reels', 'Banner', 'PDF', 'Outro'];

export function StepTechnicalSpecs({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-lg font-semibold">Especificações Técnicas</h2>
        <p className="text-sm text-muted-foreground">Formatos e dimensões da entrega</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Formato *</Label>
          <Select value={data.format} onValueChange={v => onChange({ format: v })}>
            <SelectTrigger className={errors.format ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.format && <p className="text-xs text-destructive mt-1">{errors.format}</p>}
        </div>

        <div>
          <Label htmlFor="dimensions">Dimensões *</Label>
          <Input
            id="dimensions"
            placeholder="Ex: 1080x1080px, 1920x1080px"
            value={data.dimensions}
            onChange={e => onChange({ dimensions: e.target.value })}
            className={errors.dimensions ? 'border-destructive' : ''}
          />
          {errors.dimensions && <p className="text-xs text-destructive mt-1">{errors.dimensions}</p>}
        </div>

        <div>
          <Label>Plataforma *</Label>
          <Select value={data.platform} onValueChange={v => onChange({ platform: v })}>
            <SelectTrigger className={errors.platform ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione a plataforma" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.platform && <p className="text-xs text-destructive mt-1">{errors.platform}</p>}
        </div>

        <div>
          <Label htmlFor="deliverables">Entregas esperadas *</Label>
          <Textarea
            id="deliverables"
            placeholder="Descreva todas as peças que devem ser entregues. Ex: 3 versões de feed + 2 stories + 1 capa de destaque"
            value={data.deliverables}
            onChange={e => onChange({ deliverables: e.target.value })}
            className={`min-h-[80px] ${errors.deliverables ? 'border-destructive' : ''}`}
          />
          {errors.deliverables && <p className="text-xs text-destructive mt-1">{errors.deliverables}</p>}
        </div>
      </div>
    </div>
  );
}
