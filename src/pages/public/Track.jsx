import { useState } from 'react';
import api from '../../api/client';
import { Button, Input, Card, Alert, AlertDescription } from '../../components/ui';
import { StatusBadge, PageHeader, HistoryTimeline } from '../../components/common';
import { toast } from 'sonner';

export default function Track() {
  const [ref, setRef] = useState(''),
    [data, setData] = useState(null),
    [err, setErr] = useState('');
  async function find(e) {
    e.preventDefault();
    try {
      const r = await api.get(`/grievances/track/${ref}`);
      setData(r.data.data);
      setErr('');
      toast.success('Grievance found', { description: `Reference ${r.data.data.referenceId}` });
    } catch (x) {
      const message = x.response?.data?.message || 'Not found';
      setErr(message);
      toast.error('Could not find that grievance', { description: message });
    }
  }
  return (
    <>
      <PageHeader title="Track a grievance" />
      <Card>
        <form className="flex max-w-xl gap-2" onSubmit={find}>
          <Input
            placeholder="CMK-2026-XXXXX"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            required
          />
          <Button>Track</Button>
        </form>
        {err && <Alert variant="destructive" className="mt-4"><AlertDescription>{err}</AlertDescription></Alert>}
        {data && (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current status</span>
              <StatusBadge status={data.status} actionTakenReport={data.actionTakenReport} />
              <span className="ml-auto font-mono text-xs text-muted-foreground">{data.referenceId}</span>
            </div>
            <p className="text-xl font-bold">
              {data.referenceId} · <StatusBadge status={data.status} />
            </p>
            <p className="mt-2">
              {data.subject} · {data.district} · {data.department?.name || 'Awaiting assignment'}
            </p>
            <div className="mt-6">
              <HistoryTimeline items={data.history} />
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
