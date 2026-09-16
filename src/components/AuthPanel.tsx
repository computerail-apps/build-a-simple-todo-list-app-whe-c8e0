import { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Container } from '@/lib/ui/Container';
import { LogIn, UserPlus, ListChecks } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'signin' | 'signup';

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo('Account created. If email confirmation is required, check your inbox, otherwise you are signed in.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ListChecks size={24} />
            </div>
            <h1 className="text-display text-foreground">Pendo</h1>
            <p className="mt-2 text-body text-muted-foreground">
              A clean, focused todo list. Sign in to see your tasks.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{mode === 'signin' ? 'Sign in' : 'Create an account'}</CardTitle>
              <CardDescription>
                {mode === 'signin' ? 'Welcome back — enter your details.' : 'Get started with a free account.'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Something went wrong</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {info && (
                  <Alert>
                    <AlertTitle>Check your email</AlertTitle>
                    <AlertDescription>{info}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <label className="text-small text-muted-foreground" htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-small text-muted-foreground" htmlFor="password">Password</label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {mode === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError(null);
                    setInfo(null);
                  }}
                >
                  {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </Container>
    </main>
  );
}
