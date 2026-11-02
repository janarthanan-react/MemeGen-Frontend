import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Mandatory for accessibility
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-200 ease-out select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1463E9] disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shrink-0';

    const variants = {
      primary:
        'bg-[#1463E9] hover:bg-[#0E52C7] text-white shadow-[0_2px_8px_-2px_rgba(20,99,233,0.38)] hover:shadow-[0_6px_18px_-3px_rgba(20,99,233,0.48)] border border-[#2B7AF7]/40 active:bg-[#0B43A6]',
      secondary:
        'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1463E9] hover:text-[#0E52C7] border border-blue-200/80 shadow-2xs hover:shadow-xs active:bg-blue-200/70',
      outline:
        'bg-white hover:bg-[#EFF6FF] border border-[#1463E9]/30 hover:border-[#1463E9] text-[#1463E9] hover:text-[#0E52C7] shadow-2xs hover:shadow-xs active:bg-blue-100/70',
      ghost:
        'bg-transparent text-slate-600 hover:text-[#1463E9] hover:bg-[#EFF6FF] active:bg-blue-100/70',
      danger:
        'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200/80 hover:border-rose-600 shadow-2xs hover:shadow-rose-600/25 active:bg-rose-700',
      dark:
        'bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-white/30 backdrop-blur-md shadow-2xs hover:shadow-xs active:bg-white/5',
    };

    const sizes = {
      xs: 'w-7 h-7 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
