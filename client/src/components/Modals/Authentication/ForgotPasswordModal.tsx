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
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { resetViewport } from "@/utils/utils";

export function ForgotPasswordModal({
  open,
  onOpenChange,
  onSwitchToSignIn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn: () => void;
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) {
      setEmail("");
    }
  }, [open]);

  const { forgotPassword } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleForgotPassword();
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
    toast.success("Password reset email sent!");
    onOpenChange(false);
    resetViewport();
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Forgot password?
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your email address to reset your password.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel>Email address*</FieldLabel>
                <Input
                  id="email-forgot"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="cursor-pointer">
                  Reset password
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
