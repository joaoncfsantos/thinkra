import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] gap-0">
        <DialogHeader>
          <div className="text-lg font-semibold text-neutral-900 dark:text-white">
            <DialogTitle>Settings</DialogTitle>
          </div>
        </DialogHeader>
        <Separator className="mt-2 mb-4" />
        <div className="flex items-center gap-2 justify-between text-sm text-muted-foreground">
          <p>Theme</p>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
