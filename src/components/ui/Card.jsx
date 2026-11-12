import React from 'react';
import { cn } from '../../lib/utils.js';
import { ShadcnCard } from './card-base.jsx';

export const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return <ShadcnCard ref={ref} className={cn('p-6', className)} {...props} />;
});
