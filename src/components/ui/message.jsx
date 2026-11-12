import { cn } from '@/lib/utils';

export function Message({ from = 'assistant', className, ...props }) {
  return (
    <div
      data-slot="message"
      data-from={from}
      className={cn('flex w-full', from === 'user' ? 'justify-end' : 'justify-start', className)}
      {...props}
    />
  );
}
