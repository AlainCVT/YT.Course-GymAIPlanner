import clsx from 'clsx';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          'inline-flex items-center justify-center font-medium transition-colors rounded-xl disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-accent text-black hover:bg-accent-hover': variant === 'primary',
            'bg-card text-foreground border border-border hover:bg-border': variant === 'secondary',
            'text-muted hover:text-foreground hover:bg-card': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-8 py-3 text-lg': size === 'lg',
          },
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
