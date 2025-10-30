import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Icon } from "@iconify/react";

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-md">
        <DialogHeader className="text-center space-y-2 sm:text-center">
          <div className="text-3xl font-bold mb-2 break-words">Gap & Gain</div>
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white break-words">
            Welcome back!
          </DialogTitle>
          <DialogDescription className="break-words">
            Please enter your details to sign in.
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
      </DialogContent>
    </Dialog>
  );
}
