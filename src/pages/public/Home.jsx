import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Building2,
  BusFront,
  ClipboardList,
  HeartPulse,
  Landmark,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/ui';
import AssistantWidget from '../../components/AssistantWidget.jsx';

const departmentIcons = [Building2, HeartPulse, BookOpen, Zap, BusFront];

export default function Home() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api
      .get('/departments')
      .then((response) => setDepartments(response.data.data))
      .catch(() => setDepartments([]));
  }, []);

  const statistics = [
    { value: 4392, label: 'Grievances resolved', suffix: '+', icon: ShieldCheck },
    { value: 14, label: 'Districts covered', suffix: '', icon: Landmark },
    { value: 8, label: 'Service departments', suffix: '', icon: Building2 },
    { value: 7, label: 'Day response target', suffix: ' days', icon: ClipboardList },
  ];

  return (
    <div className="w-full pb-0">
      <section className="relative isolate flex min-h-[calc(100svh-8rem)] w-full overflow-hidden bg-slate-900 text-white shadow-md md:min-h-[calc(100svh-5.5rem)]">
        <img
          src="/images/kerala-secretariat.jpg"
          alt="Kerala Government Secretariat in Thiruvananthapuram"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_62%]"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061c3e]/90 via-[#061c3e]/65 to-[#061c3e]/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1768ba]/55 via-[#1768ba]/20 to-transparent"
        />
        <div className="mx-auto flex w-full max-w-[1160px] flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-16">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.16em] text-blue-100">
            <Landmark className="h-4 w-4" /> Kerala public services
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A clear way to raise and follow a public grievance.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            Submit your concern, receive a reference number, and follow the recorded steps from
            review through resolution.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-primary text-white hover:bg-blue-800">
                Submit a grievance <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="absolute bottom-4 right-5 hidden items-center gap-2 sm:flex"
          aria-hidden="true"
        >
          <span className="h-2 w-7 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
        </div>
      </section>

      <section className="w-full border-y border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div className="animate-home-enter">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
                The process
              </p>
              <h2 className="mt-3 max-w-md text-2xl font-semibold leading-tight tracking-tight text-[#082f65] sm:text-3xl">
                Every submission has a next step.
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Review, department assignment, officer action, and resolution are recorded in one
                status history.
              </p>
              <Link
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-800"
                to="/how-it-works"
              >
                See how it works <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-4 sm:gap-4">
            {[
              ['01', 'Submit', 'Share the concern and its location.'],
              ['02', 'Review', 'The submission is reviewed.'],
              ['03', 'Assign', 'The right department receives it.'],
              ['04', 'Resolve', 'The action and outcome are recorded.'],
            ].map(([number, label, description], index) => (
              <li className="relative flex gap-4 sm:block sm:pr-5" key={number}>
                {index < 3 && (
                  <span
                    className="absolute bottom-[-1.5rem] left-[17px] top-10 w-px bg-slate-200 sm:bottom-auto sm:left-10 sm:right-0 sm:top-5 sm:h-px sm:w-auto"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-primary">
                  {number}
                </span>
                <span className="relative z-10 block bg-white sm:mt-4">
                  <span className="block text-base font-semibold text-[#082f65]">{label}</span>
                  <span className="mt-1 block max-w-[15rem] text-sm leading-5 text-slate-500">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="w-full bg-[#eceef1] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-[1160px] gap-4 md:grid-cols-2">
          <article className="grid min-h-48 grid-cols-[1fr_auto] items-center gap-4 rounded-md bg-white p-5 shadow-sm sm:p-7">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded bg-blue-50 text-primary">
                <ClipboardList className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-[#082f65]">Start a submission</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Describe the issue, select its district, and add any supporting details.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                to="/register"
              >
                Create an account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ArrowRight className="hidden h-8 w-8 text-blue-100 sm:block" />
          </article>
          <article className="grid min-h-48 grid-cols-[1fr_auto] items-center gap-4 rounded-md bg-white p-5 shadow-sm sm:p-7">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded bg-blue-50 text-primary">
                <Search className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-[#082f65]">
                Follow an existing concern
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Enter your reference ID to see the latest public status and timeline.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                to="/track"
              >
                Track by reference <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ShieldCheck className="hidden h-9 w-9 text-blue-100 sm:block" />
          </article>
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-[#16467f] to-[#315a91] px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[1160px]">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-200">
                Department directory
              </p>
              <h2 className="mt-2 text-xl font-semibold">Services across Kerala</h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:text-blue-200"
              to="/departments"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {(departments.length ? departments.slice(0, 5) : []).map((department, index) => {
              const Icon = departmentIcons[index % departmentIcons.length];
              return (
                <Link
                  className="group flex min-h-28 flex-col items-start justify-between rounded border border-white/15 bg-white/10 p-4 transition hover:bg-white/20"
                  to="/departments"
                  key={department._id}
                >
                  <Icon className="h-5 w-5 text-blue-100" />
                  <span className="text-sm font-medium leading-5">{department.name}</span>
                </Link>
              );
            })}
            {!departments.length &&
              ['Health', 'Education', 'Public Works', 'Water', 'Transport'].map((name, index) => {
                const Icon = departmentIcons[index];
                return (
                  <Link
                    className="flex min-h-28 flex-col items-start justify-between rounded border border-white/15 bg-white/10 p-4 transition hover:bg-white/20"
                    to="/departments"
                    key={name}
                  >
                    <Icon className="h-5 w-5 text-blue-100" />
                    <span className="text-sm font-medium leading-5">{name}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f1f4f8] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1160px]">
          <div className="mb-8 max-w-2xl animate-home-enter">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
              Public service snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#082f65] sm:text-3xl">
              Clear progress. Across Kerala.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A quick view of the services and timelines available through this portal.
            </p>
          </div>
          <div className="grid overflow-hidden border-y border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map(({ value, label, suffix, icon: Icon }, index) => (
              <article
                className="group min-h-44 border-b border-slate-200 p-6 opacity-0 animate-home-enter sm:border-r lg:border-b-0 last:border-r-0"
                style={{ animationDelay: `${index * 110}ms` }}
                key={label}
              >
                <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-1" />
                <p className="mt-5 text-4xl font-semibold tracking-tight text-[#082f65] tabular-nums sm:text-5xl">
                  <AnimatedNumber value={value} />
                  {suffix}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Illustrative statistics for this demonstration portal.
          </p>
        </div>
      </section>

      <section className="w-full bg-[#062b5d] px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-white/10 text-blue-100">
              <Search className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-200">
                Keep your reference number
              </p>
              <h2 className="mt-2 text-xl font-semibold">Your status is only a search away.</h2>
              <p className="mt-1 text-sm text-blue-100/80">
                Check public updates without signing in.
              </p>
            </div>
          </div>
        </div>
      </section>
      <AssistantWidget mode="public" />
    </div>
  );
}

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1400;
    let animationFrame;

    const updateNumber = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * easedProgress));
      if (progress < 1) animationFrame = requestAnimationFrame(updateNumber);
    };

    animationFrame = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return displayValue.toLocaleString();
}
