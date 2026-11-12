import { Badge as ShadcnBadge } from './Badge.jsx';

const variants = { slate: 'secondary', blue: 'info', amber: 'warning', green: 'success', red: 'destructive' };
export function Badge({ children, tone = 'slate', className = '', ...props }) {
  return <ShadcnBadge variant={variants[tone] || 'secondary'} className={className} {...props}>{children}</ShadcnBadge>;
}
