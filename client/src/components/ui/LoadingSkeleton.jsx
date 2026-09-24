import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slatevibe-200/60 shadow-soft animate-pulse flex flex-col h-[380px]">
      <div className="aspect-[4/3] bg-slatevibe-200 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-16 bg-slatevibe-200 rounded-full" />
            <div className="h-5 w-14 bg-slatevibe-200 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-slatevibe-200 rounded-md mb-3" />
          <div className="h-4 w-full bg-slatevibe-100 rounded-md mb-2" />
          <div className="h-4 w-5/6 bg-slatevibe-100 rounded-md" />
        </div>
        <div className="pt-4 border-t border-slatevibe-100 flex justify-between items-center">
          <div className="h-4 w-24 bg-slatevibe-100 rounded" />
          <div className="h-4 w-12 bg-slatevibe-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
}
