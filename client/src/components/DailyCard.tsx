import { useState } from "react";
import { Edit, Save, X, Trash2, Plus, CornerUpLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Spinner } from "./ui/shadcn-io/spinner";

export function DailyCard({
  id,
  date,
  goals,
  gains,
  onUpdate,
  onDelete,
}: DailyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editableGoals, setEditableGoals] = useState(goals);
  const [editableGains, setEditableGains] = useState(gains);
  const [errors, setErrors] = useState<{ goals?: string; gains?: string }>({});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    //Clean empty goals and gains from the array
    const cleanGoals = editableGoals.filter((goal) => goal.trim() !== "");
    const cleanGains = editableGains.filter((gain) => gain.trim() !== "");

    // Call the onUpdate callback to save changes to parent component
    if (onUpdate) {
      setIsSaving(true);
      try {
        await onUpdate(cleanGoals, cleanGains);

        // Only update local state and exit edit mode if successful
        setEditableGoals(cleanGoals);
        setEditableGains(cleanGains);
        setIsEditing(false);
        setErrors({});
      } catch (error) {
        toast.error("Failed to save changes. Please try again.");
        // Keep editing mode active so user can retry
      } finally {
        setIsSaving(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors: { goals?: string; gains?: string } = {};

    const validGoals = editableGoals.filter((goal) => goal.trim() !== "");
    const validGains = editableGains.filter((gain) => gain.trim() !== "");

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

  const handleCancel = () => {
    setIsEditing(false);
    setEditableGoals(goals);
    setEditableGains(gains);
    setErrors({});
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...editableGoals];
    newGoals[index] = value;
    setEditableGoals(newGoals);
  };

  const handleGainChange = (index: number, value: string) => {
    const newGains = [...editableGains];
    newGains[index] = value;
    setEditableGains(newGains);
  };

  const addGoal = () => {
    setEditableGoals([...editableGoals, ""]);
  };

  const addGain = () => {
    setEditableGains([...editableGains, ""]);
  };

  const removeGoal = (index: number) => {
    setEditableGoals(editableGoals.filter((_, i) => i !== index));
  };

  const removeGain = (index: number) => {
    setEditableGains(editableGains.filter((_, i) => i !== index));
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="group relative overflow-hidden border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          {formattedDate}
        </CardTitle>
        <div className="flex gap-2 opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" size="icon-lg">
                <CornerUpLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                size="icon-lg"
                disabled={isSaving}
                className="bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:hover:bg-green-800 dark:hover:text-white"
              >
                {isSaving ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => onDelete?.(id)}
                variant="outline"
                size="icon-lg"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleEdit}
                variant="outline"
                className="cursor-pointer"
                size="icon-lg"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Gains
            </h3>
          </div>
          <div className="space-y-3">
            {editableGains.map((gain, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  {index + 1}
                </span>
                {isEditing ? (
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder={`Gain ${index + 1}`}
                      value={gain}
                      onChange={(e) => handleGainChange(index, e.target.value)}
                      className={`h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 ${
                        errors.gains && "text-red-500 placeholder:text-red-300"
                      }`}
                    />
                    <Button
                      onClick={() => removeGain(index)}
                      variant="ghost"
                      size="sm"
                      disabled={editableGains.length === 1}
                      className="h-auto p-1 text-neutral-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-base leading-relaxed">{gain}</p>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="mt-3 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-dashed px-4 text-xs"
                onClick={addGain}
              >
                <Plus className="mr-1 h-3 w-3" /> Add Gain
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Goals
            </h3>
          </div>
          <div className="space-y-3">
            {editableGoals.map((goal, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {index + 1}
                </span>
                {isEditing ? (
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder={`Goal ${index + 1}`}
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      className={`h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 ${
                        errors.goals && "text-red-500 placeholder:text-red-300"
                      }`}
                    />
                    <Button
                      onClick={() => removeGoal(index)}
                      variant="ghost"
                      size="sm"
                      disabled={editableGoals.length === 1}
                      className="h-auto p-1 text-neutral-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-base leading-relaxed">{goal}</p>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="mt-3 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-dashed px-4 text-xs"
                onClick={addGoal}
              >
                <Plus className="mr-1 h-3 w-3" /> Add Goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DailyCardProps {
  id: string;
  date: string;
  goals: string[];
  gains: string[];
  onUpdate?: (goals: string[], gains: string[]) => Promise<void>; // Make it return a Promise
  onDelete?: (id: string) => void;
}
