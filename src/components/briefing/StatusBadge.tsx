import { BriefingStatus } from '@/types/briefing';

interface StatusBadgeProps {
  status: BriefingStatus;
}

const statusConfig: Record<BriefingStatus, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-muted text-muted-foreground' },
  validation: { label: 'Em validação', className: 'bg-warning/15 text-warning' },
  approved: { label: 'Aprovado', className: 'bg-success/15 text-success' },
  production: { label: 'Em produção', className: 'bg-info/15 text-info' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
