import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function ResetPasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  const { resetPassword } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmationPassword) {
      toast.error("Password confirmation failed!");
      return;
    }
    handleResetPassword();
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(password);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
    toast.success("Password reset successful!");
    onOpenChange(false);
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] sm:max-w-md"
      >
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Reset password
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your new password
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel>New Password*</FieldLabel>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Confirm New Password*</FieldLabel>
                <Input
                  id="new-confirmation-password"
                  type="password"
                  placeholder="Confirm your new password"
                  required
                  value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                />
              </Field>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="cursor-pointer">
                  Reset password
                </Button>
              </div>
            </FieldSet>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
