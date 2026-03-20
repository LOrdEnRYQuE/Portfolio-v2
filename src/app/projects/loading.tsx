import React from "react";

export default function Loading() {
  return (
    <div className="py-32 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      <div className="space-y-4 mb-20 text-center">
        <div className="h-4 w-24 bg-white/5 animate-pulse rounded-full mx-auto" />
        <div className="h-12 w-64 bg-white/10 animate-pulse rounded-2xl mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square rounded-3xl bg-white/5 border border-white/10 animate-pulse overflow-hidden p-8 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/10" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
              <div className="h-4 w-full bg-white/5 rounded-lg" />
              <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
            </div>
            <div className="pt-4 flex gap-2">
              <div className="h-6 w-16 bg-white/5 rounded-full" />
              <div className="h-6 w-16 bg-white/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
