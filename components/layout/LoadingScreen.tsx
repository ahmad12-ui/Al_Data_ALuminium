"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    // Keep it brief — this should never make users wait unnecessarily.
    const timer = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brown-950"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="relative h-24 w-24 md:h-28 md:w-28 mb-6">
              <Image
                src="/logo/aldata-logo.png"
                alt="ALDATA"
                fill
                sizes="112px"
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-cream">
              ALDATA
            </h1>
            <p className="mt-2 font-body text-[11px] md:text-xs tracking-[0.35em] uppercase text-brown-300">
              Aluminum &amp; Interior Decorators
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
              className="mt-6 h-px w-32 origin-center bg-brown-500"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-5 font-body text-xs tracking-[0.2em] uppercase text-warm-grey"
            >
              Creating Spaces...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
