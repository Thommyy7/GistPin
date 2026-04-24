'use client';

import { ReactNode } from 'react';
import ChartErrorBoundary from '@/components/ui/ChartErrorBoundary';
import ChartSkeleton from '@/components/ui/ChartSkeleton';

interface ChartWrapperProps {
  title?: string;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export default function ChartWrapper({ title, loading, children, className = '' }: ChartWrapperProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      {title && <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>}
      <ChartErrorBoundary title={title ?? 'Chart error'}>
        {loading ? <ChartSkeleton /> : children}
      </ChartErrorBoundary>
    </div>
  );
}
