import type { MetadataRoute } from "next";

// PWA manifest — installable, no service worker (DESIGN.md PWA checklist).
// Icons are placeholders; drop real 192/512/maskable PNGs in /public before the demo.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muse",
    short_name: "Muse",
    description: "The thread you keep circling.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E0B09",
    theme_color: "#0E0B09",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
