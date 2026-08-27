import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  padding = 'md',
  style,
  ...props
}) => {
  const paddingStyles = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '32px',
  };

  return (
    <div
      className={clsx('glass-card', glow && 'glow-card', className)}
      style={{
        padding: paddingStyles[padding],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
