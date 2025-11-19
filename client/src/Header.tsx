import { ModeToggle } from "./components/mode-toggle";
import { ProfileDropdown } from "./components/ProfileDropdown.tsx";
function Header() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/80">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Thinkra
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
