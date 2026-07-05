import { AppShell } from "@/components/layout/AppShell";
import { Hero } from "@/components/Hero";
import { UploadDropzone } from "@/components/UploadDropzone";
import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";

export default function Home() {
  return (
    <AppShell>
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
