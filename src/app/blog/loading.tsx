import React from "react";

export default function Loading() {
  return (
    <div className="py-24 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
       <div className="space-y-4 mb-20 text-center">
        <div className="h-4 w-24 bg-white/5 animate-pulse rounded-full mx-auto" />
        <div className="h-12 w-80 bg-white/10 animate-pulse rounded-2xl mx-auto" />
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-white/5 animate-pulse flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3 aspect-[1.3/1] bg-white/10 rounded-3xl" />
            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                 <div className="h-4 w-24 bg-white/5 rounded-md" />
                 <div className="h-4 w-24 bg-white/5 rounded-md" />
              </div>
              <div className="h-8 w-3/4 bg-white/10 rounded-xl" />
              <div className="h-4 w-full bg-white/5 rounded-lg" />
              <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
              <div className="h-10 w-40 bg-white/10 rounded-xl mt-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
