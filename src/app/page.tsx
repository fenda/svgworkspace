import { AppShell } from "@/components/layout/AppShell";
import { Hero } from "@/components/Hero";
import { UploadDropzone } from "@/components/UploadDropzone";
import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-6 pt-0">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Hero />
          <div className="-mt-4 lg:-mt-5">
            <UploadDropzone />
          </div>
        </div>
        <WorkspaceSection />
      </div>
    </AppShell>
  );
}
