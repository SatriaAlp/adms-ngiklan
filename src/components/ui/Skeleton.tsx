import React from 'react';

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 animate-pulse">
    <div className="w-full h-44 bg-slate-800 rounded-xl mb-4"></div>
    <div className="h-4 bg-slate-800 rounded w-1/3 mb-2"></div>
    <div className="h-5 bg-slate-800 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-slate-800 rounded w-full mb-4"></div>
    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
      <div className="h-6 bg-slate-800 rounded w-1/3"></div>
      <div className="h-8 bg-slate-800 rounded-lg w-24"></div>
    </div>
  </div>
);

export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 animate-pulse flex flex-col gap-3">
    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
    <div className="h-8 bg-slate-800 rounded w-1/2"></div>
    <div className="h-3 bg-slate-800 rounded w-2/3"></div>
  </div>
);
