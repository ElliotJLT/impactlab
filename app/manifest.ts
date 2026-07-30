import type { MetadataRoute } from "next";

// PWA manifest — installable, no service worker (DESIGN.md PWA checklist).
// Icons are placeholders; drop real 192/512/maskable PNGs in /public before the demo.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nocturne",
    short_name: "Nocturne",
    description: "The thread you keep circling.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8FA",
    theme_color: "#16776F",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
