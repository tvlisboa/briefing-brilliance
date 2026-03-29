import { BriefingData, PROJECT_TYPES } from '@/types/briefing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: BriefingData;
  onChange: (updates: Partial<BriefingData>) => void;
  errors: Record<string, string>;
}

export function StepProjectInfo({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-lg font-semibold">Informações do Projeto</h2>
        <p className="text-sm text-muted-foreground font-medium">Dados básicos sobre o projeto</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="projectName" >Nome do projeto *</Label>
          <Input
            id="projectName"
            placeholder="Ex: Campanha Black Friday 2026"
            value={data.projectName}
            onChange={e => onChange({ projectName: e.target.value })}
            className={errors.projectName ? 'border-destructive' : ''}
          />
          {errors.projectName && <p className="text-xs text-destructive mt-1.5">{errors.projectName}</p>}
        </div>

        <div>
          <Label htmlFor="clientName">Nome do cliente *</Label>
          <Input
            id="clientName"
            placeholder="Ex: Marca XYZ"
            value={data.clientName}
            onChange={e => onChange({ clientName: e.target.value })}
            className={errors.clientName ? 'border-destructive' : ''}
          />
          {errors.clientName && <p className="text-xs text-destructive mt-1.5">{errors.clientName}</p>}
        </div>

        <div>
          <Label>Tipo de projeto *</Label>
          <Select value={data.projectType} onValueChange={v => onChange({ projectType: v })}>
            <SelectTrigger className={errors.projectType ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectType && <p className="text-xs text-destructive mt-1">{errors.projectType}</p>}
        </div>

        <div>
          <Label htmlFor="deadline">Prazo de entrega *</Label>
          <Input
            id="deadline"
            type="date"
            min={data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}
            value={data.deadline}
            onChange={e => onChange({ deadline: e.target.value })}
            className={errors.deadline ? 'border-destructive' : ''}
          />
          {errors.deadline && <p className="text-xs text-destructive mt-1">{errors.deadline}</p>}
        </div>
      </div>
    </div>
  );
}
