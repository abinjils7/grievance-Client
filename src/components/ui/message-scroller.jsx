import * as React from 'react';
import { cn } from '@/lib/utils';

export const MessageScroller = React.forwardRef(function MessageScroller(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      data-slot="message-scroller"
      className={cn('min-h-0 flex-1 space-y-3 overflow-y-auto scroll-smooth', className)}
      {...props}
    />
  );
});
