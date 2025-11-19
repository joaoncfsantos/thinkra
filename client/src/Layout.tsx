import { Toaster } from "@/components/ui/sonner";
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      <Toaster richColors expand position="top-center" />
    </div>
  );
}

export default Layout;
