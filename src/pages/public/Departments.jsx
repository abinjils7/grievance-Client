import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  BusFront,
  Droplets,
  HeartPulse,
  Landmark,
  Search,
  Zap,
} from 'lucide-react';
import api from '../../api/client';
import { Button, Input, Label } from '../../components/ui';
import PageHero from '../../components/common/PageHero.jsx';

function getDepartmentIcon(name) {
  const departmentName = name.toLowerCase();
  if (departmentName.includes('health')) return HeartPulse;
  if (departmentName.includes('education')) return BookOpen;
  if (departmentName.includes('water')) return Droplets;
  if (departmentName.includes('electricity') || departmentName.includes('kseb')) return Zap;
  if (departmentName.includes('transport')) return BusFront;
  if (departmentName.includes('revenue')) return Landmark;
  return Building2;
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/departments')
      .then((response) => setDepartments(response.data.data))
      .catch(() => setError('Department information could not be loaded. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const visibleDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return departments;
    return departments.filter((department) =>
      `${department.name} ${department.description || ''}`.toLowerCase().includes(query),
    );
  }, [departments, search]);

  return (
    <div className="space-y-8 pb-4">
      <PageHero
        eyebrow="Departments / Service directory"
        title="The teams behind public service delivery."
        description="Explore the departments included in this directory. Each concern is reviewed before it is routed for action."
        action={
          <Link to="/how-it-works">
            <Button className="bg-white text-blue-950 hover:bg-blue-50">
              How routing works <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <section className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6 lg:sticky lg:top-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">
              Directory / Search
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              Browse services
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Filter by a department name or the service description.
            </p>
          </div>
          <Label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-12 border-slate-300 bg-white pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search directory"
              aria-label="Search departments"
            />
          </Label>
          <div className="border-l-2 border-blue-200 py-1 pl-4">
            <p className="text-sm font-semibold text-slate-900">How routing works</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              The CMO reviews each submission and assigns it to a suitable department.
            </p>
            <Link
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              to="/how-it-works"
            >
              View the process <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex items-end justify-between border-b border-slate-300 pb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
                Departments
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {loading ? 'Loading directory…' : `${visibleDepartments.length} services shown`}
              </p>
            </div>
            <span className="hidden text-xs font-semibold tracking-wide text-slate-400 sm:block">
              NAME / SERVICE / CODE
            </span>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {error}
            </p>
          )}

          {loading ? (
            <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
              {Array.from({ length: 5 }, (_, index) => (
                <div className="flex h-24 animate-pulse items-center gap-5 px-4" key={index}>
                  <span className="h-10 w-10 rounded-lg bg-slate-100" />
                  <span className="flex-1 space-y-2">
                    <span className="block h-4 w-1/3 rounded bg-slate-100" />
                    <span className="block h-3 w-2/3 rounded bg-slate-100" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
              {visibleDepartments.map((department, index) => {
                const Icon = getDepartmentIcon(department.name);
                return (
                  <article
                    className="group grid gap-4 px-4 py-5 transition-colors hover:bg-blue-50/70 sm:grid-cols-[52px_1fr_auto] sm:items-center sm:px-5"
                    key={department._id}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-primary ring-1 ring-slate-200 transition group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-mono text-xs font-medium text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-base font-semibold text-slate-950 sm:text-lg">
                          {department.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {department.description ||
                          'Department services included in this directory.'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      {department.code && (
                        <span className="font-mono text-xs font-medium tracking-wide text-slate-500">
                          {department.code}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </article>
                );
              })}
              {!visibleDepartments.length && !error && (
                <div className="px-6 py-16 text-center">
                  <Search className="mx-auto h-7 w-7 text-slate-400" />
                  <p className="mt-3 font-semibold text-slate-900">No services match that search</p>
                  <p className="mt-1 text-sm text-slate-600">Try a different name or phrase.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="grid items-center gap-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-6 sm:p-8 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Not sure which department to choose?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The review process assigns submissions to the appropriate team.
          </p>
        </div>
        <Link to="/register">
          <Button variant="outline" className="border-blue-200 bg-white">
            Submit a grievance <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
