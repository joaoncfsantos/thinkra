import { ModeToggle } from "./components/mode-toggle";

function Header() {
  return (
    <div className="text-gray-900 dark:text-gray-50 w-full h-20 flex items-center justify-between">
      <h1 className="text-3xl">Gap & Gain</h1>
      <ModeToggle />
    </div>
  );
}

export default Header;
