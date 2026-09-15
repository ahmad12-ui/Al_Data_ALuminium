export default function Loading() {
  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="aspect-[21/9] w-full bg-brown-200/60 animate-pulse" />
      <div className="section-container mt-12 space-y-3 max-w-2xl">
        <div className="h-4 w-full bg-brown-200/60 animate-pulse" />
        <div className="h-4 w-5/6 bg-brown-200/60 animate-pulse" />
      </div>
    </div>
  );
}
