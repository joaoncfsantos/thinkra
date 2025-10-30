import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-neutral-900 dark:text-white">
            Log in
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
