import { cn } from '@/lib/utils';

export function InputGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-group"
      className={cn('flex w-full items-center gap-2', className)}
      {...props}
    />
  );
}
