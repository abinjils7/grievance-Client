import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, Copy, Landmark } from 'lucide-react';
import { useState } from 'react';
import { Button, Card } from '../../components/ui';
import SubmittedIllustration from '../../components/common/SubmittedIllustration.jsx';

export default function Submitted() {
  const { state } = useLocation();
  const [copied, setCopied] = useState(false);
  const referenceId = state?.referenceId;

  async function copyReference() {
    if (!referenceId) return;
    await navigator.clipboard.writeText(referenceId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex min-h-[65vh] items-center justify-center py-8">
      <Card className="w-full max-w-2xl overflow-hidden border-slate-200 bg-white p-0 shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-[#0b69a5] via-[#168ac0] to-[#53b9cf]" />
        <div className="px-6 pb-8 pt-5 text-center sm:px-12 sm:pb-10">
          <div className="mb-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-slate-500">
            <Landmark className="h-4 w-4 text-primary" /> Public Grievance Portal
          </div>
          <SubmittedIllustration />
          <span className="mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <Check className="h-5 w-5" />
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
            Submission received
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Your concern is in the right hands.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            We’ve recorded your grievance. Keep the reference number below to follow its progress
            and see public updates.
          </p>

          <div className="mx-auto mt-7 max-w-md border-y border-slate-200 py-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Your reference number
            </p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <p className="text-xl font-semibold tracking-wide text-[#082f65] sm:text-2xl">
                {referenceId || 'Submission received'}
              </p>
              {referenceId && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={copyReference}
                  className="h-auto gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  aria-label="Copy reference number"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/track">
              <Button className="w-full sm:w-auto">
                Track this grievance <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/citizen">
              <Button variant="outline" className="w-full sm:w-auto">
                Go to my grievances
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
