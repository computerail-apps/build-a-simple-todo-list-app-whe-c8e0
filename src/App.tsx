import { Nav } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { ListChecks, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { AuthPanel } from '@/components/AuthPanel';
import { TaskBoard } from '@/components/TaskBoard';
import { supabase } from '@/lib/supabase';

export default function App() {
  const { session, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen">
        <CenteredSpinner label="Loading Pendo" />
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen">
        <Nav brand={<span className="inline-flex items-center gap-2"><ListChecks size={20} />Pendo</span>} />
        <AuthPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav
        brand={<span className="inline-flex items-center gap-2"><ListChecks size={20} />Pendo</span>}
        actions={
          <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} />
            Sign out
          </Button>
        }
      />
      <main className="py-8">
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h1 className="text-h1 text-foreground">Your tasks</h1>
              <p className="mt-1 text-body text-muted-foreground">
                Signed in as {user.email}. Click a status badge to cycle it, or add a new task below.
              </p>
            </div>
            <TaskBoard userId={user.id} />
          </div>
        </Container>
      </main>
    </div>
  );
}
