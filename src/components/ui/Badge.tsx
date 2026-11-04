import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'purple'
    | 'outline'
    | 'dark';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-semibold rounded-full border transition-colors select-none';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200/90 hover:bg-slate-200/70',
    primary: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80',
    secondary: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    dark: 'bg-white/10 text-cyan-300 border-white/15 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] [transform:translateZ(0)] shadow-2xs',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-blue-500',
    secondary: 'bg-cyan-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    outline: 'bg-slate-400',
    dark: 'bg-cyan-400',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      <span>{children}</span>
    </span>
  );
};
