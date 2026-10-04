import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  fullWidth,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={twMerge(
        'btn focus-ring',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-ghost': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-base': size === 'md',
          'px-6 py-3.5 text-lg': size === 'lg',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
