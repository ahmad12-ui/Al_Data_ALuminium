"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; title: string; description?: string; variant?: "success" | "error" | "default" };
type ToastContextType = { toast: (t: Omit<Toast, "id">) => void };

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-[calc(100%-3rem)] max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className={cn(
                "flex items-start gap-3 border bg-cream p-4 shadow-lg",
                t.variant === "success" && "border-brown-500",
                t.variant === "error" && "border-destructive",
                (!t.variant || t.variant === "default") && "border-brown-200"
              )}
            >
              {t.variant === "success" && <CheckCircle2 className="h-5 w-5 text-brown-700 shrink-0 mt-0.5" />}
              {t.variant === "error" && <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
              <div className="flex-1">
                <p className="font-body font-semibold text-sm text-brown-900">{t.title}</p>
                {t.description && <p className="font-body text-xs text-warm-grey mt-1">{t.description}</p>}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-warm-grey hover:text-brown-900"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
