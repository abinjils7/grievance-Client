import { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { Filter, RotateCw, Search, SlidersHorizontal } from 'lucide-react';
import api from '../../api/client';
import { Alert, AlertDescription, Button, Card, ChartContainer, ChartTooltip, ChartTooltipContent, Field, FieldTitle, Input, Select, Skeleton } from '../../components/ui';
import { PageHeader, GrievanceTable, StatCard } from '../../components/common';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs.jsx';
import AssistantWidget from '../../components/AssistantWidget.jsx';

const PAGE_SIZE = 8;
const chartConfig = {
  count: { label: 'Grievances', color: 'hsl(var(--primary))' },
};
const statusColors = ['#2563eb', '#f59e0b', '#22c55e', '#64748b', '#ef4444'];
const queueStatuses = {
  new: 'Submitted,Reopened',
  reviewing: 'Under Review',
  active: 'In Progress',
  review: 'Pending Review',
  resolved: 'Resolved',
  all: '',
};

export default function Cmo() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');
  const [queueTab, setQueueTab] = useState('new');
  const [filters, setFilters] = useState({ search: '', district: '', priority: '' });
  const [appliedFilters, setAppliedFilters] = useState({ search: '', district: '', priority: '' });

  const loadGrievances = useCallback(async (nextPage = 1, query = appliedFilters, status = queueStatuses[queueTab]) => {
    setLoadingList(true);
    setError('');
    try {
      const params = new URLSearchParams({ ...query, page: String(nextPage), limit: String(PAGE_SIZE) });
      if (status) params.set('status', status);
      const response = await api.get(`/cmo/grievances?${params}`);
      setItems(response.data.data.items);
      setTotal(response.data.data.total);
      setPage(nextPage);
      return true;
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Grievances could not be loaded.';
      setError(message);
      toast.error('Dashboard list could not be loaded', { description: message });
      return false;
    } finally {
      setLoadingList(false);
    }
  }, [appliedFilters, queueTab]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const response = await api.get('/cmo/stats');
      setStats(response.data.data);
    } catch (requestError) {
      toast.error('Dashboard metrics could not be loaded', { description: requestError.response?.data?.message || 'Try refreshing the page.' });
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadGrievances(1);
  }, []);

  async function applyFilters(event) {
    event?.preventDefault?.();
    setAppliedFilters(filters);
    if (await loadGrievances(1, filters)) {
      toast.success('Filters applied', { description: 'The list reflects your selected criteria.' });
    }
  }

  function clearFilters() {
    const cleared = { search: '', district: '', priority: '' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    loadGrievances(1, cleared);
    toast('Filters cleared');
  }

  const countFor = (...statuses) => statuses.reduce((sum, status) => sum + (stats?.byStatus?.find((item) => item._id === status)?.count || 0), 0);
  const legacyPendingReports = Math.max(0, (stats?.pendingReports || 0) - countFor('Pending Review'));
  const queueTabs = [
    { value: 'new', label: 'New & reopened', count: countFor('Submitted', 'Reopened') },
    { value: 'reviewing', label: 'Under review', count: countFor('Under Review') },
    { value: 'active', label: 'In progress', count: Math.max(0, countFor('In Progress') - legacyPendingReports) },
    { value: 'review', label: 'Report review', count: stats?.pendingReports ?? countFor('Pending Review') },
    { value: 'resolved', label: 'Resolved', count: countFor('Resolved') },
    { value: 'all', label: 'All grievances', count: stats?.total || 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="CMO dashboard" subtitle="Review, route, and monitor grievances across Kerala." />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Grievance metrics">
        {[
          ['Total grievances', stats?.total],
          ['Awaiting action', stats?.pending],
          ['Resolved', stats?.resolved],
          ['Overdue', stats?.overdue],
        ].map(([label, value]) => <StatCard key={label} label={label} value={loadingStats ? '—' : value ?? 0} />)}
      </section>

      {stats && (
        <section className="grid gap-4 lg:grid-cols-2" aria-label="Grievance analytics">
          <Card className="p-5 sm:p-6">
            <div className="mb-3"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Where concerns are raised</p><h2 className="mt-1 text-lg font-semibold">By district</h2></div>
            {(stats.byDistrict || []).length ? (
              <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
                <BarChart data={stats.byDistrict} margin={{ left: -18, right: 8, bottom: 8 }}>
                  <XAxis dataKey="_id" hide /><YAxis allowDecimals={false} /><ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">District data will appear as grievances are submitted.</p>}
          </Card>
          <Card className="p-5 sm:p-6">
            <div className="mb-3"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Workflow snapshot</p><h2 className="mt-1 text-lg font-semibold">By status</h2></div>
            {(stats.byStatus || []).length ? (
              <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
                <PieChart>
                  <Pie data={stats.byStatus} dataKey="count" nameKey="_id" innerRadius={58} outerRadius={92} paddingAngle={3}>
                    {stats.byStatus.map((item, index) => <Cell key={item._id} fill={statusColors[index % statusColors.length]} />)}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            ) : <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">Status breakdown will appear here.</p>}
            {!!stats.byStatus?.length && <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">{stats.byStatus.map((item, index) => <span key={item._id} className="inline-flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[index % statusColors.length] }} />{item._id} <strong className="text-foreground">{item.count}</strong></span>)}</div>}
          </Card>
        </section>
      )}

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Case management</p><h2 className="mt-1 text-xl font-semibold">{queueTabs.find((tab) => tab.value === queueTab)?.label}</h2><p className="mt-1 text-sm text-muted-foreground">Each case moves through review, department action, and resolution.</p></div>
          <Button variant="outline" size="sm" disabled={loadingList} onClick={() => loadGrievances(page)}><RotateCw className={`mr-2 h-4 w-4 ${loadingList ? 'animate-spin' : ''}`} /> Refresh</Button>
        </div>
        <Tabs value={queueTab} onValueChange={(value) => { setQueueTab(value); loadGrievances(1, appliedFilters, queueStatuses[value]); }}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-background p-2">
            {queueTabs.map((tab) => <TabsTrigger key={tab.value} value={tab.value} className="gap-2 whitespace-nowrap">{tab.label}<span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{tab.count}</span></TabsTrigger>)}
          </TabsList>
        </Tabs>
        <form className="grid items-end gap-3 border-b bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto_auto]" onSubmit={applyFilters}>
          <Field className="gap-1.5"><FieldTitle>Search</FieldTitle><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" aria-label="Search grievances" placeholder="Reference or subject" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></div></Field>
          <Field className="gap-1.5"><FieldTitle>District</FieldTitle><Input aria-label="District filter" placeholder="All districts" value={filters.district} onChange={(event) => setFilters({ ...filters, district: event.target.value })} /></Field>
          <Field className="gap-1.5"><FieldTitle>Priority</FieldTitle><Select aria-label="Priority filter" value={filters.priority} onValueChange={(priority) => setFilters({ ...filters, priority })} placeholder="Any priority" items={['Low', 'Medium', 'High'].map((value) => ({ value, label: value }))} /></Field>
          <Button type="submit" disabled={loadingList}><Filter className="mr-2 h-4 w-4" /> Apply</Button>
          <Button type="button" variant="ghost" onClick={clearFilters}><SlidersHorizontal className="mr-2 h-4 w-4" /> Clear</Button>
        </form>
        {error && <Alert variant="destructive" className="m-4"><AlertDescription>{error}</AlertDescription></Alert>}
        {loadingList ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, index) => <Skeleton className="h-12" key={index} />)}</div>
        ) : (
          <GrievanceTable items={items} page={page} total={total} onPageChange={(nextPage) => loadGrievances(nextPage)} emptyTitle="No matching grievances" emptyDescription="Adjust your filters or clear them to see the full queue." />
        )}
      </Card>
      <AssistantWidget mode="staff" />
    </div>
  );
}
