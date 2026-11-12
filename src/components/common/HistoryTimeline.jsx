export function HistoryTimeline({ items = [] }) {
  return (
    <ol className="space-y-5 border-l border-border pl-5">
      {items.map((h, i) => (
        <li key={h._id || i} className="relative">
          <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
          <p className="font-medium text-foreground">
            {h.toStatus || 'Update'}{' '}
            <span className="font-normal text-muted-foreground">
              · {new Date(h.timestamp).toLocaleString()}
            </span>
          </p>
          <p className="mt-1 text-base text-muted-foreground">{h.remark}</p>
        </li>
      ))}
    </ol>
  );
}
