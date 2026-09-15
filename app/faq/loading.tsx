export default function Loading() {
  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl space-y-4">
        <div className="h-3 w-24 bg-brown-200/60 animate-pulse" />
        <div className="h-10 w-96 bg-brown-200/60 animate-pulse" />
      </div>
      <div className="mt-14 max-w-3xl space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-full bg-brown-200/60 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
