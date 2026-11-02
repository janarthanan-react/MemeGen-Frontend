import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle' | 'dark' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold tracking-[-0.01em] transition-all duration-200 ease-out select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1463E9] disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#1463E9] hover:bg-[#0E52C7] text-white shadow-[0_2px_10px_-2px_rgba(20,99,233,0.38)] hover:shadow-[0_6px_20px_-3px_rgba(20,99,233,0.48)] border border-[#2B7AF7]/40 active:bg-[#0B43A6]',
      gradient:
        'bg-gradient-to-r from-[#1463E9] to-blue-600 hover:from-[#0E52C7] hover:to-blue-700 text-white shadow-[0_2px_12px_-2px_rgba(20,99,233,0.4)] hover:shadow-[0_8px_24px_-4px_rgba(20,99,233,0.5)] border border-blue-400/35 active:bg-[#0B43A6]',
      secondary:
        'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1463E9] hover:text-[#0E52C7] border border-blue-200/80 shadow-2xs hover:shadow-xs active:bg-blue-200/70',
      outline:
        'bg-white hover:bg-[#EFF6FF] text-[#1463E9] hover:text-[#0E52C7] border border-[#1463E9]/30 hover:border-[#1463E9] shadow-2xs hover:shadow-xs active:bg-blue-100/70',
      ghost:
        'bg-transparent text-slate-700 hover:text-[#1463E9] hover:bg-[#EFF6FF] active:bg-blue-100/70',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_2px_10px_-2px_rgba(225,29,72,0.35)] hover:shadow-[0_6px_18px_-3px_rgba(225,29,72,0.45)] border border-rose-500/30 active:bg-rose-800',
      subtle:
        'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1463E9] hover:text-[#0E52C7] border border-blue-200/70 hover:border-blue-300 active:bg-blue-200/60',
      dark:
        'bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/15 hover:border-white/35 backdrop-blur-md shadow-2xs hover:shadow-xs active:bg-white/5',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 gap-1 h-7 rounded-lg font-medium',
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-8.5 rounded-xl font-semibold',
      md: 'text-sm px-4.5 py-2.5 gap-2 h-10 rounded-xl font-semibold',
      lg: 'text-base px-6 py-3.5 gap-2.5 h-12 rounded-xl font-bold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
            role="status"
            aria-label="Loading"
          />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
