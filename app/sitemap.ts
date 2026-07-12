import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://balilimestone.id";
  const locales = ["en", "id"];
  const routes = ["/", "/about", "/services", "/product", "/artikel"];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: route === "/artikel" ? ("daily" as const) : ("weekly" as const),
      priority: route === "/" ? 1 : route === "/services" || route === "/product" ? 0.9 : 0.7,
    }))
  );
}
