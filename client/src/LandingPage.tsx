import { ForgotPasswordModal } from "./components/Modals/Authentication/ForgotPasswordModal";
import { SignInModal } from "./components/Modals/Authentication/SignInModal";
import { SignUpModal } from "./components/Modals/Authentication/SignUpModal";
import { Button } from "./components/ui/button";
import { useState } from "react";

export default function LandingPage() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <h1 className="text-3xl text-center font-bold text-black dark:text-white">
        Welcome to <br /> Gap & Gain
      </h1>
      <p className="text-lg text-center text-black dark:text-white">
        Get started with your daily journal and track your progress.
      </p>
      <Button
        onClick={() => {
          setShowSignInModal(true);
        }}
      >
        Start now!
      </Button>
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
        onSwitchToSignIn={() => {
          setShowSignInModal(true);
        }}
      />
      <ForgotPasswordModal
        open={showForgotPasswordModal}
        onOpenChange={setShowForgotPasswordModal}
        onSwitchToSignIn={() => {
          setShowSignInModal(true);
        }}
      />
    </div>
  );
}
