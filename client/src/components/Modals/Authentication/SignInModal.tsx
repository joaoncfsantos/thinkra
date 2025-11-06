import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import SocialMediaAuth from "./SocialMediaAuth";

export function SignInModal({
  open,
  onOpenChange,
  onSwitchToSignUp,
  onSwitchToForgotPassword,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignIn();
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      onOpenChange(false);
      toast.success("Signed in successfully!");
      setEmail("");
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] sm:max-w-md max-h-[calc(50vh)] sm:max-h-md overflow-y-auto"
      >
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Welcome back!
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your details to sign in
          </DialogDescription>
        </DialogHeader>
        <SocialMediaAuth />
        <div className="gap-4 flex flex-row items-center">
          <hr className="flex-1" />
          <p>or</p>
          <hr className="flex-1" />
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel>Email address*</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <div>
                <Field>
                  <FieldLabel>Password*</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <div className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer">
                        {showPassword ? (
                          <EyeClosedIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                      </div>
                    </button>
                  </div>
                </Field>
                <div className="flex justify-end text-sm text-muted-foreground hover:text-primary cursor-pointer">
                  <span
                    onClick={() => {
                      onOpenChange(false);
                      onSwitchToForgotPassword();
                    }}
                  >
                    Forgot password?
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer flex-1"
                  onClick={() => {
                    onOpenChange(false);
                    onSwitchToSignUp();
                  }}
                >
                  Sign up
                </Button>
                <Button type="submit" className="cursor-pointer flex-1">
                  Sign in
                </Button>
              </div>
            </FieldSet>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
