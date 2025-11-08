import { ForgotPasswordModal } from "./components/Modals/Authentication/ForgotPasswordModal";
import { SignInModal } from "./components/Modals/Authentication/SignInModal";
import { SignUpModal } from "./components/Modals/Authentication/SignUpModal";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { motion } from "motion/react";

export default function LandingPage() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  return (
    <motion.div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <motion.h1
        className="text-3xl text-center font-bold text-black dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        Welcome to Thinkra
      </motion.h1>
      <motion.p
        className="text-lg text-center text-black dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
      >
        Get started with your daily journal and track your progress.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
      >
        <Button
          onClick={() => {
            setShowSignInModal(true);
          }}
        >
          Start now!
        </Button>
      </motion.div>
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
    </motion.div>
  );
}
