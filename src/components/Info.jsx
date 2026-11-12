import { Card, CardContent, CardHeader, CardTitle } from './ui';

export default function Info({ title, children }) {
  return (
    <Card className="p-0">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
