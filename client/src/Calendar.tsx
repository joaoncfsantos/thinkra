import { useState } from "react";
import { Button } from "./components/ui/button";
import { Calendar as CalendarComponent } from "./components/ui/calendar";

function Calendar({
  selectedDates,
  setSelectedDates,
  handleDateSelect,
  datesWithEntries,
}: {
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  handleDateSelect: (dates: Date[] | undefined) => void;
  datesWithEntries: Date[];
}) {
  const [month, setMonth] = useState<Date>(new Date());

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-between">
        <Button
          variant="outline"
          onClick={() => setSelectedDates([])}
          disabled={selectedDates.length === 0}
          className="flex-end text-neutral-900 dark:text-white"
        >
          Clear Selected ({selectedDates.length})
        </Button>
        <Button
          variant="outline"
          onClick={() => setMonth(new Date())}
          className="flex-end text-neutral-900 dark:text-white"
        >
          Today
        </Button>
      </div>

      <CalendarComponent
        className="border rounded-md"
        mode="multiple"
        month={month}
        onMonthChange={setMonth}
        selected={selectedDates}
        onSelect={handleDateSelect}
        disabled={{ after: new Date() }}
        modifiers={{
          hasEntry: datesWithEntries,
        }}
        modifiersClassNames={{
          hasEntry: "bg-neutral-100 dark:bg-neutral-800 font-bold rounded-md",
        }}
        classNames={{
          outside: "!text-muted-foreground opacity-50",
          day: "text-neutral-900 dark:text-white",
          day_button:
            "hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
          selected: "!bg-blue-500 !text-white hover:!bg-blue-500 !rounded-md",
          disabled: "!text-muted-foreground !opacity-50",
          caption_label: "text-neutral-900 dark:text-white",
          button_previous:
            "text-neutral-900 dark:text-white size-(--cell-size) p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-center",
          button_next:
            "text-neutral-900 dark:text-white size-(--cell-size) p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-center",
        }}
      />
    </div>
  );
}
export default Calendar;
