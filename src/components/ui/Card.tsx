import React from 'react';
import clsx from 'clsx';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div 
      className={clsx(
        'bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return <div className={clsx('p-6', className)}>{children}</div>;
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => {
  return (
    <div className={clsx('px-6 py-4 bg-gray-50 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };