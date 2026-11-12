import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, MessageSquareText, ShieldCheck } from 'lucide-react';
import api from '../../api/client';
import { useActionStore } from '../../stores/actionStore';
import { Alert, AlertDescription, Button, Card, Input, Label, Textarea } from '../../components/ui';
import { toast } from 'sonner';

const fields = 'block space-y-2 text-sm font-medium text-slate-700';

export default function Contact() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const actionKey = useRef(`contact:${Math.random().toString(36).slice(2)}`).current;
  const status = useActionStore((state) => state.actions[actionKey]?.status);
  const runOnce = useActionStore((state) => state.runOnce);

  async function send(event) {
    event.preventDefault();
    setError('');
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await runOnce(actionKey, () => api.post('/contact', formData));
      if (!result.skipped) {
        setDone(true);
        toast.success('Message sent', { description: 'Your enquiry has been saved for review.' });
      }
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Could not send your enquiry. Please try again.';
      setError(message);
      toast.error('Message could not be sent', { description: message });
    }
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden border-y border-[#0b4e83] bg-[#082f65] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-200">
            Contact the portal team
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            We’re here to hear from you.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100/90">
            Send a question or share feedback about this portal. Include enough detail for us to
            understand what you need.
          </p>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <aside className="space-y-4">
          <Card className="overflow-hidden border-0 bg-slate-950 p-0 text-white shadow-xl">
            <div className="bg-gradient-to-br from-blue-950 to-indigo-800 p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-blue-100">
                <MessageSquareText className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold">A direct line for your enquiry</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                Use the form to send a message about the portal experience.
              </p>
              <div className="mt-7 flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-3">
                <Mail className="h-5 w-5 shrink-0 text-blue-200" />
                <span className="text-sm text-blue-50">Your message is saved for review.</span>
              </div>
            </div>
          </Card>
          <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-slate-950">Please avoid sensitive information</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  This is a fictional demonstration. Do not include passwords, financial details, or
                  private documents in an enquiry.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <Card className="border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          {done ? (
            <div className="py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">Message received</h2>
              <p className="mx-auto mt-2 max-w-md text-base leading-7 text-slate-600">
                Thanks for taking the time to contact us. Your enquiry has been saved.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Send a message
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  How can we help?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Fields marked required must be completed before sending.
                </p>
              </div>
              <form className="space-y-5" onSubmit={send}>
                {error && (
                  <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Label className={fields}>
                    Your name
                    <Input name="name" required placeholder="Enter your name" autoComplete="name" />
                  </Label>
                  <Label className={fields}>
                    Email address
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Label>
                </div>
                <Label className={fields}>
                  Subject
                  <Input name="subject" required placeholder="What is your enquiry about?" />
                </Label>
                <Label className={fields}>
                  Message
                  <Textarea
                    name="message"
                    required
                    minLength={5}
                    rows={5}
                    placeholder="Add the details that will help us understand your message."
                  />
                </Label>
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-500">
                    Your enquiry will be stored for review.
                  </p>
                  <Button disabled={status === 'pending' || status === 'done'}>
                    {status === 'pending'
                      ? 'Sending…'
                      : status === 'done'
                        ? 'Sent'
                        : 'Send enquiry'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
