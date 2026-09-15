export default function Loading() {
  return (
    <div className="pt-28 md:pt-32 pb-24 section-container">
      <div className="max-w-3xl space-y-4">
        <div className="h-3 w-24 bg-brown-200/60 animate-pulse" />
        <div className="h-10 w-full max-w-lg bg-brown-200/60 animate-pulse" />
      </div>
      <div className="aspect-[16/10] w-full bg-brown-200/60 animate-pulse mt-10" />
    </div>
  );
}
