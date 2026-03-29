import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBriefings, deleteBriefing } from '@/lib/briefing-storage';
import { BriefingData, BriefingStatus } from '@/types/briefing';
import { StatusBadge } from '@/components/briefing/StatusBadge';
import { ScoreDisplay } from '@/components/briefing/ScoreDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, Calendar, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_FILTERS: { value: BriefingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'validation', label: 'Validação' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'production', label: 'Produção' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [briefings, setBriefings] = useState<BriefingData[]>(getAllBriefings);
  const [statusFilter, setStatusFilter] = useState<BriefingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return briefings
      .filter(b => statusFilter === 'all' || b.status === statusFilter)
      .filter(b =>
        !searchQuery ||
        b.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [briefings, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: briefings.length,
    draft: briefings.filter(b => b.status === 'draft').length,
    validation: briefings.filter(b => b.status === 'validation').length,
    approved: briefings.filter(b => b.status === 'approved').length,
    production: briefings.filter(b => b.status === 'production').length,
  }), [briefings]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBriefing(id);
    setBriefings(getAllBriefings());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link to="/">
                <h1 className="text-xl font-bold tracking-tight">Briefing</h1>
              </Link>
              <p className="text-sm text-muted-foreground font-medium">Gerencie seus briefings</p>
            </div>
            <Button size="sm" onClick={() => navigate('/briefing/new')}>
              <Plus className="w-4 h-4 mr-1" /> Novo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Rascunho', count: stats.draft, color: 'text-muted-foreground' },
              { label: 'Validação', count: stats.validation, color: 'text-warning' },
              { label: 'Aprovado', count: stats.approved, color: 'text-success' },
              { label: 'Produção', count: stats.production, color: 'text-info' },
            ].map(s => (
              <div key={s.label} className="text-center p-2 bg-muted/50 rounded-lg">
                <p className={`text-lg font-bold ${s.color}`}>{s.count}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por projeto ou cliente..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Briefing list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              {briefings.length === 0 ? 'Nenhum briefing criado ainda' : 'Nenhum resultado encontrado'}
            </p>
            {briefings.length === 0 && (
              <Button size="sm" className="mt-4" onClick={() => navigate('/briefing/new')}>
                <Plus className="w-4 h-4 mr-1" /> Criar primeiro briefing
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(b => (
              <div
                key={b.id}
                onClick={() => navigate(`/briefing/${b.id}`)}
                className="glass-card p-4 card-hover cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{b.projectName || 'Sem nome'}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{b.clientName || 'Cliente não definido'}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(b.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span>{b.projectType || 'Tipo não definido'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreDisplay score={b.score} compact />
                    <button
                      onClick={(e) => handleDelete(b.id, e)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
