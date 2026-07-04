import { AppShell } from "@/components/layout/AppShell";
import { Hero } from "@/components/Hero";
import { QuickActions } from "@/components/QuickActions";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Workspace } from "@/components/workspace/Workspace";

export default function PlaygroundPage() {
  return (
    <AppShell>
      <div className="space-y-10 pt-0">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Hero />
          <div className="-mt-7 lg:-mt-7">
            <UploadDropzone />
          </div>
        </div>
        <QuickActions />
        <Workspace />
      </div>
    </AppShell>
  );
}
