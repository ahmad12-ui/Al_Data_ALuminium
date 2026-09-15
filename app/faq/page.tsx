import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFaqs } from "@/lib/data";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ | ALDATA",
  description: "Answers to common questions about ALDATA's interior design, aluminium, steel, and renovation services.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Support</p>
        <h1 className="font-display text-4xl md:text-5xl text-brown-900">Frequently Asked Questions</h1>
        <p className="font-body text-warm-grey mt-4">
          Everything you need to know before starting a project with ALDATA.
        </p>
      </div>

      <div className="mt-14 max-w-3xl">
        {faqs.length === 0 ? (
          <p className="font-body text-warm-grey py-10">No FAQs available yet.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq: any) => (
              <AccordionItem value={faq._id} key={faq._id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-14 border border-brown-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-brown-900">Still have questions?</h2>
            <p className="font-body text-sm text-warm-grey mt-1">We&rsquo;re happy to walk you through it.</p>
          </div>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
