import type { MetadataRoute } from "next";

const DOMAIN = process.env.DOMAIN || "https://malyar.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/catalog",
    "/about",
    "/cases",
    "/reviews",
    "/solutions",
    "/consultation",
    "/cart",
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes would be fetched from DB in production
  const productRoutes = [
    "/catalog/vodnye-kraski",
    "/catalog/kraski-po-metallu",
    "/catalog/dekorativnye-shtukaturki",
    "/catalog/malyarnyy-instrument",
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
