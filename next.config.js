/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    // Serve AVIF first, falling back to WebP, before the original format —
    // meaningfully smaller payloads for the same visual result.
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Removes the "X-Powered-By: Next.js" response header (minor
  // best-practices/info-disclosure cleanup, zero functional impact).
  poweredByHeader: false,

  async headers() {
    return [
      {
        // The /public/logo asset is a fixed brand asset that is never
        // replaced through the admin panel (per spec, it's supplied once
        // and not redesigned), so a long, effectively-immutable cache is
        // safe and directly addresses the "efficient cache lifetimes"
        // Lighthouse finding. If the logo file is ever swapped, change its
        // filename so browsers pick up the new asset instead of the cache.
        source: "/logo/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Security headers appropriate for this app's actual surface area:
        // no third-party iframes embedding *us*, one first-party iframe
        // *we* embed (Google Maps, optionally, via Admin → Settings), no
        // window.opener cross-origin flows, and no user-uploaded HTML.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Clickjacking protection — this app is never meant to be framed
          // by another origin.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No use of camera/mic/geolocation anywhere in the app.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // COOP is safe here: nothing relies on window.opener access across
          // origins (no OAuth-style popups, no cross-origin postMessage).
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            // Pragmatic CSP for a Next.js app router site with Tailwind +
            // Cloudinary images + an optional Google Maps iframe embed.
            // 'unsafe-inline'/'unsafe-eval' on script-src are required
            // because Next.js's hydration bootstrap and dev/HMR runtime rely
            // on inline/eval'd scripts; tightening this to a nonce-based
            // strict CSP is a valid follow-up but needs per-request nonce
            // wiring through middleware, which is a larger, separate change
            // and not something to bolt on without testing.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' https://res.cloudinary.com data:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "font-src 'self' data:",
              "frame-src https://www.google.com https://maps.google.com",
              "connect-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // HSTS only has effect over HTTPS. Vercel (this project's documented
          // deployment target) already sets this at the edge in production;
          // it's included here too for self-hosted deployments behind a
          // reverse proxy that doesn't already set it. If you deploy behind
          // nginx/Cloudflare with its own HSTS config, prefer setting it
          // there instead of duplicating it.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
