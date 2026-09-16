import { useState, FormEvent } from 'react';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Plus } from 'lucide-react';

interface QuickAddProps {
  onAdd: (title: string) => void;
  pending: boolean;
}

export function QuickAdd({ onAdd, pending }: QuickAddProps) {
  const [title, setTitle] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Add a task and press Enter"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={pending}
      />
      <Button type="submit" disabled={pending || !title.trim()}>
        <Plus size={16} />
        Add
      </Button>
    </form>
  );
}
