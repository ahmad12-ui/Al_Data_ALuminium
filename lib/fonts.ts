import { Playfair_Display, Manrope } from "next/font/google";

// Only the weights actually referenced anywhere in the codebase are loaded.
// (Verified via `grep -roh "font-(normal|medium|semibold|bold|extrabold|black)"` —
// only default/400, 600 (semibold), and 700 (bold) are ever used. Requesting the
// full 400–900 range was pulling unused font files onto every page.)
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
