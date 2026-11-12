import { Link } from 'react-router-dom';
import { ArrowRight, Eye, FileCheck2, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui';

const principles = [
  {
    icon: Eye,
    title: 'Clear progress',
    text: 'A reference number and visible status history make each step easier to follow.',
  },
  {
    icon: ShieldCheck,
    title: 'Responsible review',
    text: 'Submissions move through review and department assignment before a response is recorded.',
  },
  {
    icon: FileCheck2,
    title: 'Documented action',
    text: 'The workflow records action reports and review outcomes alongside the grievance.',
  },
];

export default function About() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden border-y border-[#0b4e83] bg-[#082f65] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A clearer path from concern to response.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-blue-100/90">
              This portal demonstrates how a public grievance can be submitted, reviewed, routed to
              a department, and followed through to a documented outcome.
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-base font-semibold text-blue-950 transition hover:bg-blue-50"
              to="/how-it-works"
            >
              Explore the process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-200">
              A service journey
            </p>
            <div className="mt-6 space-y-4">
              {[
                ['01', 'Listen', 'Capture the issue and supporting details.'],
                ['02', 'Route', 'Review the concern and assign the right department.'],
                ['03', 'Follow through', 'Record action and share a clear outcome.'],
              ].map(([number, title, text]) => (
                <div className="flex gap-4" key={number}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-sm font-semibold text-blue-100">
                    {number}
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-1 block text-sm leading-5 text-blue-100/75">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Purpose</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Make the process easier to understand.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The portal focuses on a simple resident experience and a traceable staff workflow. Each
            submission has a clear reference, a review path, and a history of public updates.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <Card className="border-slate-200 bg-white p-5 shadow-sm" key={title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary ring-1 ring-blue-100">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <p className="rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm leading-6 text-blue-950">
        This is a fictional demonstration. It is not a government service.
      </p>
    </div>
  );
}
