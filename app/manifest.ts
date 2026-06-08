import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} Portfolio`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1E1E1E",
    theme_color: "#1E1E1E",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
