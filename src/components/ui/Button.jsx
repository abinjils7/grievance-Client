import React from 'react';
import { buttonVariants, ShadcnButton } from './button-base.jsx';

export const Button = React.forwardRef(function Button({ variant = 'default', ...props }, ref) {
  const shadcnVariant = variant === 'primary' ? 'default' : variant;
  return <ShadcnButton ref={ref} variant={shadcnVariant} {...props} />;
});

export { buttonVariants };
