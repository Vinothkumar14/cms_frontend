import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    fullWidth = false, 
    className, 
    leftIcon, 
    rightIcon, 
    ...props 
  }, ref) => {
    const inputClasses = clsx(
      'px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
      {
        'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !error,
        'border-red-500 focus:border-red-500 focus:ring-red-500': error,
        'w-full': fullWidth,
        'pl-10': leftIcon,
        'pr-10': rightIcon
      },
      className
    );

    return (
      <div className={clsx('flex flex-col', { 'w-full': fullWidth })}>
        {label && (
          <label className="mb-2 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </span>
          )}
          
          <input ref={ref} className={inputClasses} {...props} />
          
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </span>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;