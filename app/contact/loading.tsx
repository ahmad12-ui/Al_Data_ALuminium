export default function Loading() {
  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl space-y-4">
        <div className="h-3 w-24 bg-brown-200/60 animate-pulse" />
        <div className="h-10 w-96 bg-brown-200/60 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 mt-14">
        <div className="lg:col-span-3 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 w-full bg-brown-200/60 animate-pulse" />
          ))}
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 w-full bg-brown-200/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
