import { useCallback, useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';
import api from '../../api/client';
import { Alert, AlertDescription, Button, Card, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui';
import { PageHeader, GrievanceTable, StatCard } from '../../components/common';
import { toast } from 'sonner';
import AssistantWidget from '../../components/AssistantWidget.jsx';

const buckets = [
  { key: 'new', label: 'New assignments', title: 'Newly assigned to you', emptyTitle: 'No new assignments', emptyDescription: 'New cases routed to your department will appear here.' },
  { key: 'active', label: 'In progress', title: 'Work in progress', emptyTitle: 'No active cases', emptyDescription: 'Cases you have opened and are still working on will appear here.' },
  { key: 'review', label: 'Awaiting CMO review', title: 'Action reports submitted', emptyTitle: 'No reports awaiting review', emptyDescription: 'After you submit an action report, it will be listed here until the CMO reviews it.' },
];

export default function Officer() {
  const [lists, setLists] = useState({ new: [], active: [], review: [] });
  const [selected, setSelected] = useState('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async (notify = false) => {
    setLoading(true);
    setError('');
    try {
      const [newCases, activeCases, reviewCases] = await Promise.all(
        buckets.map(({ key }) => api.get(`/officer/grievances?bucket=${key}`)),
      );
      setLists({ new: newCases.data.data, active: activeCases.data.data, review: reviewCases.data.data });
      if (notify) toast.success('Your case lists are up to date');
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Assigned grievances could not be loaded.';
      setError(message);
      toast.error('Could not load your case lists', { description: message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  const selectedBucket = buckets.find((bucket) => bucket.key === selected) || buckets[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title="Officer dashboard" subtitle="Review new assignments, continue active work, and follow submitted reports." />
        <Button variant="outline" className="mb-6" disabled={loading} onClick={() => load(true)}><RotateCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh queue</Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Your queue summary">
        <StatCard label="New assignments" value={loading ? '—' : lists.new.length} />
        <StatCard label="In progress" value={loading ? '—' : lists.active.length} />
        <StatCard label="Awaiting CMO review" value={loading ? '—' : lists.review.length} />
      </section>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-4 border-b px-5 py-5 sm:px-6">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">My department</p><h2 className="mt-1 text-xl font-semibold">{selectedBucket.title}</h2></div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{lists[selected].length} cases</span>
        </div>
        <Tabs value={selected} onValueChange={setSelected}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-background p-2">
            {buckets.map(({ key, label }) => <TabsTrigger key={key} value={key} className="gap-2 whitespace-nowrap">{label}<span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{lists[key].length}</span></TabsTrigger>)}
          </TabsList>
          {buckets.map((bucket) => (
            <TabsContent key={bucket.key} value={bucket.key} className="mt-0">
              {error ? <div className="p-4"><Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert><Button className="mt-3" variant="outline" onClick={() => load(true)}>Try again</Button></div> : loading ? <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-12" key={index} />)}</div> : <GrievanceTable items={lists[bucket.key]} emptyTitle={bucket.emptyTitle} emptyDescription={bucket.emptyDescription} />}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
      <AssistantWidget mode="staff" />
    </div>
  );
}
