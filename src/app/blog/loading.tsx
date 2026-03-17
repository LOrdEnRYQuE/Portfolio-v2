export default function BlogLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-accent-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[30%] right-[5%] w-[30%] h-[30%] bg-accent-purple/5 rounded-full blur-[100px]" />
      </div>

      {/* Header Skeleton */}
      <header className="relative z-10 pt-20 pb-12 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
          <div className="mx-auto w-40 h-6 rounded-full bg-white/5 border border-white/10" />
          <div className="mx-auto w-[80%] h-16 md:h-20 rounded-2xl bg-white/5" />
          <div className="mx-auto w-[60%] h-6 rounded-lg bg-white/5" />
        </div>
      </header>

      {/* Posts Section Skeleton */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl border border-white/5 bg-surface/50 p-6 space-y-4 animate-pulse">
              <div className="w-full aspect-video rounded-2xl bg-white/5" />
              <div className="w-[40%] h-4 rounded-full bg-white/5" />
              <div className="w-full h-8 rounded-lg bg-white/5" />
              <div className="w-full h-20 rounded-lg bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
