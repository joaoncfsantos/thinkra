import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { User, LogOut, Settings, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { SignInModal } from "./Modals/Authentication/SignInModal";
import { SignUpModal } from "./Modals/Authentication/SignUpModal";
import { ForgotPasswordModal } from "./Modals/Authentication/ForgotPasswordModal";

export function ProfileDropdown() {
  const { user, signOut } = useAuth();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
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
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  toast.success("Logged out successfully!");
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setShowSignInModal(true);
              }}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={() => setShowSignUpModal(true)}
        onSwitchToForgotPassword={() => {
          setShowForgotPasswordModal(true);
        }}
      />
      <SignUpModal
        open={showSignUpModal}
        onOpenChange={setShowSignUpModal}
        onSwitchToSignIn={() => setShowSignInModal(true)}
      />
      <ForgotPasswordModal
        open={showForgotPasswordModal}
        onOpenChange={setShowForgotPasswordModal}
        onSwitchToSignIn={() => setShowSignInModal(true)}
      />
    </>
  );
}
