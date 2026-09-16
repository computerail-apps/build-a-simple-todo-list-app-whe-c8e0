import { Badge } from '@/lib/ui/Badge';
import { Button } from '@/lib/ui/Button';
import { Trash2 } from 'lucide-react';
import type { TaskStatus } from '@/lib/tasks';

const statusMeta: Record<TaskStatus, { label: string; variant: 'default' | 'success' | 'warning' }> = {
  pending: { label: 'Pending', variant: 'default' },
  'in-progress': { label: 'In progress', variant: 'warning' },
  done: { label: 'Done', variant: 'success' },
};

interface TaskRowProps {
  title: string;
  status: TaskStatus;
  onCycleStatus: () => void;
  onDelete: () => void;
  busy: boolean;
}

export function TaskRow({ title, status, onCycleStatus, onDelete, busy }: TaskRowProps) {
  const meta = statusMeta[status];
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <button
        type="button"
        onClick={onCycleStatus}
        disabled={busy}
        className="transition-transform duration-150 ease-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full disabled:opacity-50"
        aria-label={`Cycle status, currently ${meta.label}`}
      >
        <Badge variant={meta.variant}>{meta.label}</Badge>
      </button>
      <div className={`flex-1 text-body ${status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
        {title}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={busy}
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
