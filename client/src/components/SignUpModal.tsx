import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldLabel, FieldSet } from "./ui/field";
import { Icon } from "@iconify/react";
import { Input } from "./ui/input";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { toast } from "sonner";

export function SignUpModal({
  open,
  onOpenChange,
  onSwitchToLogin,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
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
          <div className="text-3xl font-bold mb-2 break-words">Gap & Gain</div>
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Create an account!
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your details to create an account
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 w-full sm:flex-row flex-col justify-center">
          <Button variant="outline" className="justify-center flex-1">
            <Icon
              icon="logos:google-icon"
              className="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span>Google</span>
          </Button>
          <Button variant="outline" className="justify-center flex-1">
            <Icon
              icon="logos:facebook"
              className="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span>Facebook</span>
          </Button>
          <Button variant="outline" className="justify-center flex-1">
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
          <form onSubmit={handleSignUp}>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignUp();
                    }
                  }}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignUp();
                    }
                  }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSignUp();
                      }
                    }}
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
                <Button
                  onClick={handleSignUp}
                  type="button"
                  className="cursor-pointer"
                >
                  Sign up
                </Button>
                <div
                  onClick={() => {
                    onOpenChange(false);
                    onSwitchToLogin();
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
