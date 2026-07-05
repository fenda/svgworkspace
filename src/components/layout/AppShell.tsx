import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastViewport } from "@/components/ui/toast-viewport";
import { MobileLanding } from "@/components/MobileLanding";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastViewport />
      <div className="md:hidden">
        <MobileLanding />
      </div>
      <div className="hidden min-h-screen bg-[#0a0a0c] md:block">
        <Sidebar />
        <div className="lg:pl-52">
          <Header />
          <main className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
