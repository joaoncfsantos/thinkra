import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Field, FieldLabel, FieldSet } from "../../ui/field";
import { Icon } from "@iconify/react";
import { Input } from "../../ui/input";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function SignUpModal({
  open,
  onOpenChange,
  onSwitchToSignIn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password confirmation failed!");
      return;
    }
    handleSignUp();
  };

  const handleSignUp = async () => {
    try {
      await signUp(name, email, password);
      onOpenChange(false);
      toast.success(
        "Signed up successfully! Please confirm your email to continue."
      );
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] sm:max-w-md"
      >
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Create an account!
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your details to create an account
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 w-full sm:flex-row flex-col justify-center">
          <Button variant="outline" className="justify-center flex-1" disabled>
            <Icon
              icon="logos:google-icon"
              className="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span>Google</span>
          </Button>
          <Button variant="outline" className="justify-center flex-1" disabled>
            <Icon
              icon="logos:facebook"
              className="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span>Facebook</span>
          </Button>
          <Button variant="outline" className="justify-center flex-1" disabled>
            <Icon
              icon="logos:apple"
              className="w-4 h-4 mr-2 dark:invert flex-shrink-0"
            />
            <span>Apple</span>
          </Button>
        </div>
        <div className="gap-4 flex flex-row items-center">
          <hr className="flex-1" />
          <p>or</p>
          <hr className="flex-1" />
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel>Name*</FieldLabel>
                <Input
                  id="user-name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
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
              <Field>
                <FieldLabel>Confirm password*</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              <div className="flex flex-col gap-2">
                <Button type="submit" className="cursor-pointer">
                  Sign up
                </Button>
                <div
                  onClick={() => {
                    onOpenChange(false);
                    onSwitchToSignIn();
                  }}
                  className="flex justify-center text-sm text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Already have an account? Sign in!
                </div>
              </div>
            </FieldSet>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
