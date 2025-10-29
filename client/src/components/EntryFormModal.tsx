import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Plus, CalendarIcon, X } from "lucide-react";
import { AudioRecorder } from "./AudioRecorder";
import { toast } from "sonner";

interface EntryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { date: string; goals: string[]; gains: string[] }) => void;
  handleAudioSubmission: (audioBlob: Blob) => void;
  isTranscribing: boolean;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export const EntryFormModal: React.FC<EntryFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  handleAudioSubmission,
  isTranscribing,
}) => {
  // Date picker state
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [month, setMonth] = useState<Date | undefined>(selectedDate);
  const [dateValue, setDateValue] = useState(formatDate(selectedDate));

  // Form state
  const [goals, setGoals] = useState<string[]>([""]);
  const [gains, setGains] = useState<string[]>([""]);
  const [errors, setErrors] = useState<{ goals?: string; gains?: string }>({});

  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  // ... existing functions (addGoal, removeGoal, updateGoal, addGain, removeGain, updateGain, validateForm) ...
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
      toast.error("At least one goal is required");
    }

    if (validGains.length === 0) {
      newErrors.gains = "At least one gain is required";
      toast.error("At least one gain is required");
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

    // Convert selected date to ISO string format for consistency
    const dateString = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    onSubmit({
      date: dateString,
      goals: validGoals,
      gains: validGains,
    });

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(today);
    setDateValue(formatDate(today));
    setGoals([""]);
    setGains([""]);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw]  max-h-[50vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <DialogTitle>
                <p className="text-2xl text-neutral-900 dark:text-white">
                  New Entry
                </p>
              </DialogTitle>
            </div>
            {/* Date Picker */}
            <div className="flex flex-1 flex-col gap-3 max-w-xs">
              <div className="relative flex gap-2 w-full">
                <Input
                  id="date"
                  value={dateValue}
                  className="bg-background pr-10 border-none  text-neutral-900 dark:text-white"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setDateValue(e.target.value);
                    if (isValidDate(date)) {
                      setSelectedDate(date);
                      setMonth(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setDatePickerOpen(true);
                    }
                  }}
                  onClick={() => setDatePickerOpen(true)}
                />
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-picker"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2 text-neutral-900 dark:text-neutral-50 "
                    >
                      {datePickerOpen ? (
                        <X className="size-3.5" />
                      ) : (
                        <CalendarIcon className="size-3.5" />
                      )}
                      <span className="sr-only">Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      captionLayout="dropdown"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setDateValue(formatDate(date));
                        setDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-neutral-900 dark:text-white "
        >
          {/* Goals Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Goals</Label>
            </div>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Goal ${index + 1}`}
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    className={`dark:border-neutral-700 ${
                      errors.goals && "!border-red-700 border-2"
                    }`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    onClick={() => removeGoal(index)}
                    className="px-2"
                    disabled={goals.length === 1}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
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
            </div>
            <div className="space-y-2">
              {gains.map((gain, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Gain ${index + 1}`}
                    value={gain}
                    onChange={(e) => updateGain(index, e.target.value)}
                    className={`dark:border-neutral-700 ${
                      errors.gains && "!border-red-700 border-2"
                    }`}
                  />
                  {
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-lg"
                      onClick={() => removeGain(index)}
                      className="px-2"
                      disabled={gains.length === 1}
                    >
                      <X className="size-3.5" />
                    </Button>
                  }
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                type="button"
                onClick={addGain}
              >
                <Plus />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center justify-between">
            <AudioRecorder
              onRecordingComplete={handleAudioSubmission}
              isTranscribing={isTranscribing}
            />

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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
