import { cn } from '@/lib/utils';

export function Bubble({ from = 'assistant', className, ...props }) {
  return (
    <div
      data-slot="message-bubble"
      className={cn(
        'max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 shadow-sm',
        from === 'user'
          ? 'rounded-br-md bg-primary text-primary-foreground'
          : 'rounded-bl-md border bg-background text-foreground',
        className,
      )}
      {...props}
    />
  );
}
