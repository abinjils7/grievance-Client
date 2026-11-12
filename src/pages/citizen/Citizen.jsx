import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, RotateCw } from 'lucide-react';
import api from '../../api/client';
import { Alert, AlertDescription, Button, Card, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Skeleton } from '../../components/ui';
import { GrievanceTable, StatCard } from '../../components/common';
import PageHero from '../../components/common/PageHero.jsx';
import { toast } from 'sonner';

export default function Citizen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGrievances = useCallback((showToast = false) => {
    setLoading(true);
    setError('');
    api
      .get('/grievances/mine')
      .then((response) => {
        setItems(response.data.data);
        if (showToast) toast.success('Your list is up to date');
      })
      .catch((requestError) => {
        const message = requestError.response?.data?.message || 'Your grievances could not be loaded.';
        setError(message);
        toast.error('Could not refresh your grievances', { description: message });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  const counts = useMemo(
    () => ({
      total: items.length,
      active: items.filter((item) => item.status !== 'Resolved').length,
      resolved: items.filter((item) => item.status === 'Resolved').length,
    }),
    [items],
  );

  return (
    <div className="space-y-7">
      <PageHero
        eyebrow="Citizen workspace"
        title="Your submissions, all in one place."
        description="Review your grievances, follow their status, and open the full history whenever you need an update."
        action={
          <Link to="/submit">
            <Button className="bg-white text-blue-950 hover:bg-blue-50">
              Submit a grievance <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Grievance summary">
        <StatCard label="Total submissions" value={loading ? '—' : counts.total} />
        <StatCard label="Awaiting resolution" value={loading ? '—' : counts.active} />
        <StatCard label="Resolved" value={loading ? '—' : counts.resolved} />
      </section>

      <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
              Submission history
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              My grievances
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a reference to see its details and public updates.
            </p>
          </div>
          <Button
            variant="outline"
            className="self-start sm:self-auto"
            onClick={() => loadGrievances(true)}
            disabled={loading}
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {error ? (
          <div className="p-6 sm:p-8">
            <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
            <Button className="mt-4" variant="outline" onClick={() => loadGrievances(true)}>
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-12" key={index} />
            ))}
          </div>
        ) : items.length ? (
          <GrievanceTable items={items} />
        ) : (
          <Empty className="min-h-72 border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon"><ClipboardList /></EmptyMedia>
              <EmptyTitle>No grievances submitted yet</EmptyTitle>
              <EmptyDescription>Start a submission to receive a reference number and follow every update here.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent><Link to="/submit"><Button><ClipboardList className="h-4 w-4" /> Submit your first grievance</Button></Link></EmptyContent>
          </Empty>
        )}
      </Card>
    </div>
  );
}
