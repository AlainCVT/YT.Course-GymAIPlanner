import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
  theme?: 'primary';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', theme, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          'rounded-2xl p-6',
          {
            border: variant === 'bordered',
          },
          {
            'bg-card border-border': !theme,
            'bg-primary/5 border-primary/20!': theme === 'primary',
          },
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
