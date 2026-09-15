import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-24">
      <h1 className="font-display text-3xl text-brown-900">Service not found</h1>
      <p className="font-body text-warm-grey mt-3">This service may have been removed or renamed.</p>
      <Button asChild className="mt-8">
        <Link href="/services">Back to Services</Link>
      </Button>
    </div>
  );
}
