import React from 'react';

export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 p-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-800/50 rounded-xl w-full"></div>
      ))}
    </div>
  );
}
