import { useState } from "react";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DailyCard({ date, goals, gains, onUpdate }: DailyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableGoals, setEditableGoals] = useState(goals);
  const [editableGains, setEditableGains] = useState(gains);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Call the onUpdate callback to save changes to parent component
    if (onUpdate) {
      onUpdate(date, editableGoals, editableGains);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setEditableGoals(goals);
    setEditableGains(gains);
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

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-bold">{date}</CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                variant="outline"
                size="icon"
                className="text-green-600 hover:text-green-700"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="icon"
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="cursor-pointer"
              size="icon"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="border-t pt-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Gains:</h3>
            {isEditing && (
              <Button
                onClick={addGain}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Add Gain
              </Button>
            )}
          </div>
          <ol className="list-decimal list-inside space-y-1">
            {editableGains.map((gain, index) => (
              <li key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={gain}
                      onChange={(e) => handleGainChange(index, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      placeholder="Enter gain..."
                    />
                    <Button
                      onClick={() => removeGain(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <span className="first-letter:uppercase">
                    {index + 1}.&nbsp;{gain}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Goals:</h3>
            {isEditing && (
              <Button
                onClick={addGoal}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Add Goal
              </Button>
            )}
          </div>
          <ol className="list-decimal list-inside space-y-1">
            {editableGoals.map((goal, index) => (
              <li key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      placeholder="Enter goal..."
                    />
                    <Button
                      onClick={() => removeGoal(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <span className="first-letter:uppercase">
                    {index + 1}.&nbsp;{goal}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

interface DailyCardProps {
  date: string;
  goals: string[];
  gains: string[];
  onUpdate?: (date: string, goals: string[], gains: string[]) => void;
}
