import React from 'react';

interface EInkCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  id?: string;
  noShadow?: boolean;
}

export default function EInkCard({
  children,
  className = '',
  title,
  subtitle,
  id,
  noShadow = false
}: EInkCardProps) {
  return (
    <div
      id={id}
      className={`bg-paper-light eink-border-thin rounded-lg p-5 flex flex-col transition-all duration-150 ${
        noShadow ? '' : 'eink-shadow'
      } ${className}`}
    >
      {title && (
        <div className="border-b-2 border-charcoal pb-2 mb-4">
          <h3 className="font-display font-bold text-lg tracking-tight uppercase flex justify-between items-center text-charcoal">
            {title}
            {subtitle && (
              <span className="font-mono text-xs font-normal normal-case text-charcoal-muted">
                {subtitle}
              </span>
            )}
          </h3>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
