import type { MetadataRoute } from "next";
import { modules } from "@/data/modules";

const BASE = "https://jobarchitecture.arminoorata.com";
const LAST_MODIFIED = new Date("2026-04-30");

const topLevelRoutes = [
  "",
  "/learn",
  "/leveling",
  "/calibration",
  "/glossary",
  "/methodology",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = topLevelRoutes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: LAST_MODIFIED,
  }));

  const moduleEntries = modules.map((module) => ({
    url: `${BASE}/learn/${module.id}`,
    lastModified: LAST_MODIFIED,
  }));

  return [...staticEntries, ...moduleEntries];
}
