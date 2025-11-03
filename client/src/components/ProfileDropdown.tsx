import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { User, LogOut, Settings, LogIn } from "lucide-react";

import { SignInModal } from "./SignInModal";
import { SignUpModal } from "./SignUpModal";
import { useState } from "react";

const user = null;

export function ProfileDropdown() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <User className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {user ? (
            <>
              <DropdownMenuItem>
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="w-4 h-4" />
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setShowSignInModal(true);
              }}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={() => setShowSignUpModal(true)}
      />
      <SignUpModal
        open={showSignUpModal}
        onOpenChange={setShowSignUpModal}
        onSwitchToLogin={() => setShowSignInModal(true)}
      />
    </>
  );
}
