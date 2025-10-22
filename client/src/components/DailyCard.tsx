import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DailyCard({ date, goals, gains }: DailyCardProps) {
  const handleEdit = () => {
    console.log("edit");
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-bold">{date}</CardTitle>
        <Button
          onClick={handleEdit}
          variant="outline"
          className="cursor-pointer"
          size="icon"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="border-t pt-4">
        <h3 className="font-semibold mb-2">Gains:</h3>
        <ol className="list-decimal list-inside">
          {gains.map((gain) => (
            <li className="first-letter:uppercase" key={gain}>
              {gain}
            </li>
          ))}
        </ol>
        <h3 className="font-semibold mb-2 mt-4">Goals:</h3>
        <ol className="list-decimal list-inside">
          {goals.map((goal) => (
            <li className="first-letter:uppercase" key={goal}>
              {goal}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

interface DailyCardProps {
  date: string;
  goals: string[];
  gains: string[];
}
