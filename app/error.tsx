"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-2xl md:text-3xl text-brown-900">Something went wrong.</h1>
      <p className="font-body text-warm-grey mt-3 max-w-md">
        Please try again, or head back to the homepage.
      </p>
      <div className="flex gap-3 mt-8">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" asChild>
          <a href="/">Home</a>
        </Button>
      </div>
    </div>
  );
}
