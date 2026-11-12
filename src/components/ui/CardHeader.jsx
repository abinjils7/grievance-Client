import { cn } from '../../lib/utils';

export function CardHeader({ children, className = '' }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>;
}
