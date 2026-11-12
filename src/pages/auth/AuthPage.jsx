import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, Search, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useActionStore } from '../../stores/actionStore';
import { Alert, AlertDescription, Button, Input, Label } from '../../components/ui';
import { field } from '../../constants.js';
import { toast } from 'sonner';

export default function AuthPage({ register = false }) {
  const login = useAuthStore((s) => s.login),
    signup = useAuthStore((s) => s.register),
    nav = useNavigate(),
    runOnce = useActionStore((s) => s.runOnce);
  const actionKey = useRef(
    `auth:${register ? 'register' : 'login'}:${Math.random().toString(36).slice(2)}`,
  ).current;
  const [error, setError] = useState(''),
    [submitting, setSubmitting] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    const d = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const action = await runOnce(actionKey, () =>
        register ? signup(d) : login(d.email, d.password),
      );
      if (action.skipped) return;
      const u = action.result;
      toast.success(register ? 'Your account is ready' : 'Welcome back', { description: 'Opening your workspace…' });
      nav(u.role === 'cmo' ? '/cmo' : u.role === 'officer' ? '/officer' : '/citizen');
    } catch (x) {
      const message = x.response?.data?.message || 'Unable to sign in';
      setError(message);
      toast.error(register ? 'Could not create your account' : 'Sign in failed', { description: message });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-primary p-8 text-white sm:p-10 lg:p-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            PUBLIC GRIEVANCE PORTAL
          </span>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            {register ? 'Get started with your account' : 'Welcome back'}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/85">
            {register
              ? 'Create a citizen account to submit concerns and follow their progress.'
              : 'Sign in to review your submissions, follow progress, and take the next step.'}
          </p>
          <div className="mt-9 space-y-5">
            {[
              [
                ClipboardList,
                'Submit a concern',
                'Share the issue with the right district and category.',
              ],
              [Search, 'Track updates', 'Follow public progress using your reference ID.'],
              [ShieldCheck, 'See the outcome', 'Review action reports and resolution history.'],
            ].map(([Icon, title, description]) => (
              <div key={title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-base leading-6 text-white/80">
                    {description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        {!register && (
          <div className="mt-10 rounded-lg border border-white/20 bg-white/10 p-5">
            <p className="font-semibold">Demo accounts</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-white/75">CMO</p>
                <p className="mt-1 font-medium">cmo@demo.test</p>
              </div>
              <div>
                <p className="text-sm text-white/75">Citizen</p>
                <p className="mt-1 font-medium">citizen1@demo.test</p>
              </div>
            </div>
            <p className="mt-3 text-base">
              Shared password: <span className="font-semibold">Demo@1234</span>
            </p>
          </div>
        )}
      </section>
      <section className="flex items-center p-7 sm:p-10 lg:p-12">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {register ? 'Citizen registration' : 'Secure sign-in'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {register ? 'Create your citizen account' : 'Sign in to continue'}
          </h2>
          <p className="mt-2 text-base leading-6 text-muted-foreground">
            {register
              ? 'Use your contact details to create an account.'
              : 'Enter your account details below to open your dashboard.'}
          </p>
          {error && <Alert variant="destructive" className="mt-5"><AlertDescription>{error}</AlertDescription></Alert>}
          <form className="mt-7 space-y-5" onSubmit={submit}>
            {register && (
              <>
                <Label className={field}>
                  Full name
                  <Input name="name" autoComplete="name" placeholder="Your full name" required />
                </Label>
                <Label className={field}>
                  Mobile number
                  <Input
                    name="mobile"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Your mobile number"
                    required
                  />
                </Label>
              </>
            )}
            <Label className={field}>
              Email address
              <Input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </Label>
            <Label className={field}>
              Password
              <Input
                name="password"
                type="password"
                autoComplete={register ? 'new-password' : 'current-password'}
                placeholder="Enter your password"
                required
              />
            </Label>
            <Button className="w-full" size="lg" disabled={submitting}>
              {submitting ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-base text-muted-foreground">
            {register ? 'Already registered?' : 'New to the portal?'}{' '}
            <Link
              className="font-semibold text-primary hover:underline"
              to={register ? '/login' : '/register'}
            >
              {register ? 'Sign in' : 'Create a citizen account'}
            </Link>
          </p>
          <p className="mt-6 border-t pt-5 text-sm leading-6 text-muted-foreground">
            Demo accounts and sample records are fictional.
          </p>
        </div>
      </section>
    </div>
  );
}
