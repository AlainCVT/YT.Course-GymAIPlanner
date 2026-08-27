import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(className, 'rounded-2xl p-6 bg-card', {
          'border border-border': variant === 'bordered',
        })}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
