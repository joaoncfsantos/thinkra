import { ModeToggle } from "./components/mode-toggle";
import { ProfileDropdown } from "./components/ProfileDropdown.tsx";
function Header() {
  return (
    <div className="text-gray-900 dark:text-gray-50 w-full h-20 flex items-center justify-between">
      <h1 className="text-3xl">Gap & Gain</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <ProfileDropdown />
      </div>
    </div>
  );
}

export default Header;
