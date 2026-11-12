import { Card, CardContent, CardHeader } from '../ui';

export function StatCard({ label, value }) {
  return (
    <Card className="p-0">
      <CardHeader className="p-5 pb-0">
        <p className="text-base text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent className="p-5 pt-2">
        <p className="text-3xl font-semibold tracking-tight text-foreground">{value ?? '—'}</p>
      </CardContent>
    </Card>
  );
}
