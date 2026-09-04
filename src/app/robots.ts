import type { MetadataRoute } from "next";

const DOMAIN = process.env.DOMAIN || "https://malyar.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
