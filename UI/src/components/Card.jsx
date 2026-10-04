import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={twMerge('glass-card p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};
