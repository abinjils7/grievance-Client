import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardCheck,
  FilePlus2,
  MessageSquareText,
  Route,
  SearchCheck,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import PageHero from '../../components/common/PageHero.jsx';

const steps = [
  {
    icon: FilePlus2,
    title: 'Submit your concern',
    text: 'Choose a district and category, describe the issue, and attach supporting material if useful.',
    actor: 'Citizen',
  },
  {
    icon: SearchCheck,
    title: 'Initial review',
    text: 'The CMO reviews the submission and checks the details before deciding where it should go.',
    actor: 'CMO',
  },
  {
    icon: Route,
    title: 'Department assignment',
    text: 'The grievance is assigned to a relevant department and its officer for follow-up.',
    actor: 'CMO',
  },
  {
    icon: MessageSquareText,
    title: 'Action is recorded',
    text: 'The officer documents the action taken and sends the report for review.',
    actor: 'Officer',
  },
  {
    icon: ClipboardCheck,
    title: 'Outcome is reviewed',
    text: 'The CMO reviews the report and records a resolution or sends it back for further action.',
    actor: 'CMO',
  },
];

export default function How() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="The grievance journey"
        title="Five steps. One trackable process."
        description="Every stage has a clear owner, from the first submission through department action and final review."
        action={
          <Link to="/register">
            <Button className="bg-white text-blue-950 hover:bg-blue-50">
              Start a submission <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      >
        <div className="grid grid-cols-5 gap-2" aria-label="Five workflow stages">
          {steps.map((step, index) => (
            <div className="flex items-center gap-2" key={step.title}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-sm font-semibold">
                {index + 1}
              </span>
              {index < steps.length - 1 && <span className="h-px flex-1 bg-white/35" />}
            </div>
          ))}
        </div>
      </PageHero>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {steps.map(({ icon: Icon, title, text, actor }, index) => (
          <Card
            key={title}
            className="relative overflow-hidden border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary ring-1 ring-blue-100">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-3xl font-semibold tracking-tight text-slate-200">
                0{index + 1}
              </span>
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">
              {actor}
            </p>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </Card>
        ))}
      </section>

      <section className="grid items-center gap-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-6 sm:p-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-lg font-semibold text-slate-950">Keep your reference number</p>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
            Use it to check public status updates at any time. Public tracking shows workflow
            progress without exposing personal details or internal remarks.
          </p>
        </div>
        <Link to="/track">
          <Button variant="outline" className="border-blue-200 bg-white">
            Track a grievance <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
