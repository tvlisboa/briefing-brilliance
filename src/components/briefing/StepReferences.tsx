import { useState } from 'react';
import { BriefingData, Reference } from '@/types/briefing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link2, Image, Video, X, Plus } from 'lucide-react';

interface Props {
  data: BriefingData;
  onChange: (updates: Partial<BriefingData>) => void;
  errors: Record<string, string>;
}

export function StepReferences({ data, onChange, errors }: Props) {
  const [linkInput, setLinkInput] = useState('');

  const addReference = (type: Reference['type'], url: string, name: string) => {
    const ref: Reference = { id: crypto.randomUUID(), type, url, name };
    onChange({ references: [...data.references, ref] });
  };

  const removeReference = (id: string) => {
    onChange({ references: data.references.filter(r => r.id !== id) });
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      const isVideo = /youtube|vimeo|\.mp4/.test(linkInput);
      addReference(isVideo ? 'video' : 'link', linkInput.trim(), linkInput.trim());
      setLinkInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      addReference(isVideo ? 'video' : 'image', url, file.name);
    });
    e.target.value = '';
  };

  const getIcon = (type: Reference['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <Link2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-lg font-semibold">Referências Visuais</h2>
        <p className="text-sm text-muted-foreground">
          Anexe pelo menos 1 referência (imagem, link ou vídeo) *
        </p>
      </div>

      {errors.references && (
        <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">{errors.references}</p>
      )}

      <div className="space-y-3">
        <div>
          <Label>Adicionar link</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddLink()}
            />
            <Button type="button" size="sm" onClick={handleAddLink} disabled={!linkInput.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Upload de arquivos</Label>
          <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors">
            <Image className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Clique para enviar imagens ou vídeos</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {data.references.length > 0 && (
        <div className="space-y-2">
          <Label>Referências adicionadas ({data.references.length})</Label>
          <div className="grid grid-cols-1 gap-2">
            {data.references.map(ref => (
              <div key={ref.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {ref.type === 'image' ? (
                  <img src={ref.url} alt={ref.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center">
                    {getIcon(ref.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{ref.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{ref.type}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReference(ref.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
