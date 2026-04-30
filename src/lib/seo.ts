import type { Metadata } from "next";

const OG_IMAGE_ALT =
  "Job Architecture Toolkit. The six layers most leveling conversations skip past.";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: OG_IMAGE_ALT,
  type: "image/png",
};

/**
 * Build a per-route Metadata object so the page <title>, og:title,
 * and twitter:title all match (e.g., "Learn · Job Architecture Toolkit"),
 * the description renders on every social-card field, and the shared
 * Open Graph image is re-attached.
 *
 * Next.js does not deep-merge openGraph between root and child routes,
 * so each child has to re-state the image, type, site name, and twitter
 * card. This helper centralises that.
 */
export function pageMetadata({
  title,
  description,
  openGraphType = "website",
}: {
  title: string;
  description: string;
  openGraphType?: "website" | "article";
}): Metadata {
  const fullTitle = `${title} · Job Architecture Toolkit`;
  return {
    title,
    description,
    openGraph: {
      type: openGraphType,
      url: "https://jobarchitecture.arminoorata.com",
      siteName: "Job Architecture Toolkit",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: "@arminoorata",
      images: [OG_IMAGE],
    },
  };
}
