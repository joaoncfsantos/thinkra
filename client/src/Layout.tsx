import { Toaster } from "@/components/ui/sonner";
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-neutral-50 dark:bg-neutral-900 text-white px-[5%] md:px-[10%]">
      {children}
      <Toaster richColors expand position="top-center" />
    </div>
  );
}

export default Layout;
