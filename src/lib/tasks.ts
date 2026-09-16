import { supabase, TASKS_TABLE } from '@/lib/supabase';

export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  created_at: string;
}

export const STATUS_ORDER: TaskStatus[] = ['pending', 'in-progress', 'done'];

export function nextStatus(current: TaskStatus): TaskStatus {
  const idx = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from(TASKS_TABLE)
    .select('id,title,status,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function insertTask(title: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from(TASKS_TABLE)
    .insert({ title, status: 'pending', user_id: userId });
  if (error) throw error;
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase.from(TASKS_TABLE).update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from(TASKS_TABLE).delete().eq('id', id);
  if (error) throw error;
}
