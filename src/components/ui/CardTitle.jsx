import { cn } from '../../lib/utils';

export function CardTitle({ children, className = '' }) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h2>
  );
}
