import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  shortcut?: string;
  variant?: 'light' | 'dark';
  shape?: 'pill' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  wrapperClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      wrapperClassName,
      value,
      onChange,
      onClear,
      shortcut,
      variant = 'light',
      shape = 'rounded',
      size = 'md',
      placeholder = 'Search memes, templates...',
      ...props
    },
    ref
  ) => {
    const hasValue = Boolean(value && String(value).length > 0);

    const variantStyles = {
      light: cn(
        'bg-slate-50/90 text-slate-900 placeholder:text-slate-400 border-slate-200',
        'hover:bg-white hover:border-slate-300',
        'focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs'
      ),
      dark: cn(
        'bg-white/5 text-white placeholder:text-slate-400 border-white/15 backdrop-blur-md',
        'hover:bg-white/10 hover:border-cyan-400/40',
        'focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-inner'
      ),
    };

    const sizeStyles = {
      sm: 'h-9 text-base sm:text-xs pl-9',
      md: 'h-10 text-base sm:text-sm pl-10',
      lg: 'h-12 text-base pl-11',
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const iconLeftPads = {
      sm: 'pl-3',
      md: 'pl-3.5',
      lg: 'pl-4',
    };

    const rightPadding = hasValue && onClear ? 'pr-9' : shortcut ? 'pr-14' : 'pr-3.5';

    return (
      <div className={cn('relative w-full flex items-center', wrapperClassName)}>
        {/* Left Search Icon - perfectly centered vertically */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 transition-colors z-10',
            iconLeftPads[size]
          )}
        >
          <Search className={iconSizes[size]} />
        </div>

        {/* Input Field */}
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full border transition-all duration-200 focus:outline-none',
            '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            shape === 'pill' ? 'rounded-full' : 'rounded-xl',
            variantStyles[variant],
            sizeStyles[size],
            rightPadding,
            className
          )}
          {...props}
        />

        {/* Right Actions: Clear Button or Optional Shortcut */}
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5 z-10">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-full hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer',
                variant === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-400 hover:text-[#1463E9] hover:bg-[#EFF6FF]'
              )}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {shortcut && !hasValue && (
            <kbd
              className={cn(
                'hidden sm:inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md font-mono select-none border',
                variant === 'dark'
                  ? 'text-slate-400 bg-blue-950/60 border-blue-700/40'
                  : 'text-slate-500 bg-slate-100 border-slate-200'
              )}
            >
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
