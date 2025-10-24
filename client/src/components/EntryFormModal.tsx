import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface EntryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { date: string; goals: string[]; gains: string[] }) => void;
}

export const EntryFormModal: React.FC<EntryFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [goals, setGoals] = useState<string[]>([""]);
  const [gains, setGains] = useState<string[]>([""]);
  const [errors, setErrors] = useState<{ goals?: string; gains?: string }>({});

  const addGoal = () => {
    setGoals([...goals, ""]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const addGain = () => {
    setGains([...gains, ""]);
  };

  const removeGain = (index: number) => {
    if (gains.length > 1) {
      setGains(gains.filter((_, i) => i !== index));
    }
  };

  const updateGain = (index: number, value: string) => {
    const newGains = [...gains];
    newGains[index] = value;
    setGains(newGains);
  };

  const validateForm = () => {
    const newErrors: { goals?: string; gains?: string } = {};

    const validGoals = goals.filter((goal) => goal.trim() !== "");
    const validGains = gains.filter((gain) => gain.trim() !== "");

    if (validGoals.length === 0) {
      newErrors.goals = "At least one goal is required";
    }

    if (validGains.length === 0) {
      newErrors.gains = "At least one gain is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validGoals = goals.filter((goal) => goal.trim() !== "");
    const validGains = gains.filter((gain) => gain.trim() !== "");

    onSubmit({
      date,
      goals: validGoals,
      gains: validGains,
    });

    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setGoals([""]);
    setGains([""]);
    setErrors({});
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setGoals([""]);
    setGains([""]);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[50vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <p className="text-neutral-900 dark:text-white">Create New Entry</p>
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 text-neutral-900 dark:text-white "
        >
          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-neutral-900 dark:text-white">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Goals Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Goals</Label>

              {errors.goals && (
                <p className="text-sm text-red-500">{errors.goals}</p>
              )}
            </div>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Goal ${index + 1}`}
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                  />
                  {goals.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeGoal(index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={addGoal}
              >
                <Plus />
              </Button>
            </div>
          </div>

          {/* Gains Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Gains</Label>
              {errors.gains && (
                <p className="text-sm text-red-500">{errors.gains}</p>
              )}
            </div>
            <div className="space-y-2">
              {gains.map((gain, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Gain ${index + 1}`}
                    value={gain}
                    onChange={(e) => updateGain(index, e.target.value)}
                  />
                  {gains.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeGain(index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={addGain}
              >
                <Plus />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              className="text-neutral-900 dark:text-white"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit">Create Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
