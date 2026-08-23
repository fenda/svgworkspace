import type { Metadata } from "next";

export function createNoIndexMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  return {
    title: `${title} | SVG Workspace`,
    description,
    alternates: {
      canonical: pathname,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}
