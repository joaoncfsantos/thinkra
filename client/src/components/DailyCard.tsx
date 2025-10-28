import { useState } from "react";
import { Edit, Save, X, Trash2, Plus, CornerUpLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export function DailyCard({
  id,
  date,
  goals,
  gains,
  onUpdate,
  onDelete,
}: DailyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableGoals, setEditableGoals] = useState(goals);
  const [editableGains, setEditableGains] = useState(gains);
  const [errors, setErrors] = useState<{ goals?: string; gains?: string }>({});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setIsEditing(false);

    //Clean empty goals and gains from the array
    const cleanGoals = editableGoals.filter((goal) => goal.trim() !== "");
    const cleanGains = editableGains.filter((gain) => gain.trim() !== "");

    setEditableGoals(cleanGoals);
    setEditableGains(cleanGains);

    // Clear errors on successful save
    setErrors({});

    // Call the onUpdate callback to save changes to parent component
    if (onUpdate) {
      onUpdate(cleanGoals, cleanGains);
    }
  };

  const validateForm = () => {
    const newErrors: { goals?: string; gains?: string } = {};

    const validGoals = editableGoals.filter((goal) => goal.trim() !== "");
    const validGains = editableGains.filter((gain) => gain.trim() !== "");

    if (validGoals.length === 0) {
      newErrors.goals = "At least one goal is required";
    }

    if (validGains.length === 0) {
      newErrors.gains = "At least one gain is required";
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
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-bold">{formattedDate}</CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" size="icon-lg">
                <CornerUpLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                size="icon-lg"
                className="bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:hover:bg-green-800 dark:hover:text-white"
              >
                <Save className="w-4 h-4" />
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

      <CardContent className="border-t pt-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Gains:</h3>
            {errors.gains && (
              <p className="text-sm text-red-500">{errors.gains}</p>
            )}
          </div>
          <ol className="list-decimal list-inside space-y-1">
            {editableGains.map((gain, index) => (
              <li key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Input
                      placeholder={`Gain ${index + 1}`}
                      value={gain}
                      onChange={(e) => handleGainChange(index, e.target.value)}
                      className="dark:border-neutral-700"
                    />
                    <Button
                      onClick={() => removeGain(index)}
                      variant="outline"
                      size="icon-lg"
                      disabled={editableGains.length === 1}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <span className="first-letter:uppercase">
                    {index + 1}.&nbsp;{gain}
                  </span>
                )}
              </li>
            ))}
            {isEditing && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={addGain}
                >
                  <Plus />
                </Button>
              </div>
            )}
          </ol>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Goals:</h3>
            {errors.goals && (
              <p className="text-sm text-red-500">{errors.goals}</p>
            )}
          </div>
          <ol className="list-decimal list-inside space-y-1">
            {editableGoals.map((goal, index) => (
              <li key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Input
                      placeholder={`Gain ${index + 1}`}
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      className="dark:border-neutral-700"
                    />
                    <Button
                      onClick={() => removeGoal(index)}
                      variant="outline"
                      size="icon-lg"
                      disabled={editableGoals.length === 1}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <span className="first-letter:uppercase">
                    {index + 1}.&nbsp;{goal}
                  </span>
                )}
              </li>
            ))}
            {isEditing && (
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
            )}
          </ol>
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
  onUpdate?: (goals: string[], gains: string[]) => void;
  onDelete?: (id: string) => void;
}
