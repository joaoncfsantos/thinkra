function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-neutral-50 dark:bg-neutral-900 text-white px-[5%] md:px-[10%]">
      {children}
    </div>
  );
}

export default Layout;
