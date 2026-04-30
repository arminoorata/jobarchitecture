import type { MetadataRoute } from "next";

const routes = ["", "/learn", "/leveling", "/calibration", "/glossary", "/methodology"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://jobarchitecture.arminoorata.com${route}`,
    lastModified: new Date("2026-04-30"),
  }));
}
