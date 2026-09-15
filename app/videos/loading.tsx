export default function Loading() {
  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl space-y-4">
        <div className="h-3 w-24 bg-brown-200/60 animate-pulse" />
        <div className="h-10 w-72 bg-brown-200/60 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video bg-brown-200/60 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
