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

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] sm:max-w-md"
      >
        <DialogHeader className="text-center space-y-2">
          <div className="text-3xl font-bold mb-2 break-words">Gap & Gain</div>
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Welcome back!
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your details to sign in
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
          <form>
            <FieldSet>
              <Field>
                <FieldLabel>Email address*</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
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
                <div
                  onClick={() => {}}
                  className="flex justify-end text-sm text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Forgot password?
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" className="cursor-pointer">
                  Sign in
                </Button>
                <div
                  onClick={() => {}}
                  className="flex justify-center text-sm text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Don't have an account? Sign up!
                </div>
              </div>
            </FieldSet>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
