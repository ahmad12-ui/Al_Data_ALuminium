import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      {/* brown-300 on cream measured at 2.6:1 — fails WCAG AA even at large-text
          size (needs 3:1). brown-500 passes at 5.0:1, same warm-brown family. */}
      <p className="font-display text-7xl md:text-8xl text-brown-500">404</p>
      <h1 className="font-display text-2xl md:text-3xl text-brown-900 mt-4">
        This page couldn&rsquo;t be found.
      </h1>
      <p className="font-body text-warm-grey mt-3 max-w-md">
        The page you&rsquo;re looking for may have been moved or no longer exists.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
