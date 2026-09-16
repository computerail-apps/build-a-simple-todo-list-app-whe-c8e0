import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/lib/ui/Card';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { ListChecks, RefreshCw } from 'lucide-react';
import { QuickAdd } from '@/components/QuickAdd';
import { TaskRow } from '@/components/TaskRow';
import { fetchTasks, insertTask, updateTaskStatus, deleteTask, nextStatus, type Task } from '@/lib/tasks';

interface TaskBoardProps {
  userId: string;
}

export function TaskBoard({ userId }: TaskBoardProps) {
  const qc = useQueryClient();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: fetchTasks,
  });

  const addMutation = useMutation({
    mutationFn: (title: string) => insertTask(title, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const cycleMutation = useMutation({
    mutationFn: (task: Task) => updateTaskStatus(task.id, nextStatus(task.status)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  return (
    <div className="space-y-4">
      <QuickAdd onAdd={(title) => addMutation.mutate(title)} pending={addMutation.isPending} />

      {addMutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>Couldn't add task</AlertTitle>
          <AlertDescription>{(addMutation.error as Error).message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <CenteredSpinner label="Loading tasks" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load tasks</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{(error as Error).message}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw size={14} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={20} />}
          title="No tasks yet"
          description="Add your first task above to get started."
        />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {data.map((task) => (
              <TaskRow
                key={task.id}
                title={task.title}
                status={task.status}
                busy={cycleMutation.isPending || deleteMutation.isPending || isRefetching}
                onCycleStatus={() => cycleMutation.mutate(task)}
                onDelete={() => deleteMutation.mutate(task.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
