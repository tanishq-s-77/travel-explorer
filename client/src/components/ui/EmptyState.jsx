import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';

export default function EmptyState({
  title = "No destinations found",
  description = "We couldn't find any destinations matching your current filters.",
  actionLabel = "Reset all filters",
  onAction,
  icon: Icon = Compass
}) {
  return (
    <div className="text-center py-16 px-4 bg-white/70 backdrop-blur-sm rounded-3xl border border-slatevibe-200/70 shadow-soft max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-skyvibe-100 text-skyvibe-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Icon className="w-8 h-8 animate-bounce" />
      </div>
      <h3 className="text-xl font-bold text-slatevibe-900 mb-2">{title}</h3>
      <p className="text-sm text-slatevibe-600 mb-6 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyvibe-600 hover:bg-skyvibe-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
