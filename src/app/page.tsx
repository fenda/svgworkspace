import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Hero } from "@/components/Hero";
import { UploadDropzone } from "@/components/UploadDropzone";
import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "SVG Workspace",
      url: SITE_URL,
    },
    {
      "@type": "SoftwareApplication",
      name: "SVG Workspace",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web browser",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
  ],
};

export default function Home() {
  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="space-y-6 pt-0">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Hero />
          <div className="-mt-2 lg:-mt-3">
            <UploadDropzone />
          </div>
        </div>
        <WorkspaceSection />
      </div>
    </AppShell>
  );
}
