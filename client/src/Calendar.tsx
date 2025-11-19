import { useState } from "react";
import { Button } from "./components/ui/button";
import { Calendar as CalendarComponent } from "./components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { X, CalendarIcon } from "lucide-react";

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
    <Card className="border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-neutral-900 dark:text-white">
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-neutral-500" />
            Filter by Date
          </span>
          {selectedDates.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDates([])}
              className="h-8 px-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
            >
              Clear ({selectedDates.length})
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          className="p-0"
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
            hasEntry: "bg-neutral-100 dark:bg-neutral-800 font-bold",
          }}
          classNames={{
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "flex items-center justify-between absolute inset-x-0 top-0 pt-1 px-2",
            nav_button:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-neutral-200 dark:border-neutral-800 rounded-md transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800",
            nav_button_previous: "",
            nav_button_next: "",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-neutral-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-neutral-400",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-neutral-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-neutral-800",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors",
            day_selected:
              "!bg-neutral-900 !text-neutral-50 hover:!bg-neutral-900 hover:!text-neutral-50 focus:!bg-neutral-900 focus:!text-neutral-50 dark:!bg-neutral-50 dark:!text-neutral-900 dark:hover:!bg-neutral-50 dark:hover:!text-neutral-900 dark:focus:!bg-neutral-50 dark:focus:!text-neutral-900",
            day_today:
              "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
            day_outside: "text-neutral-500 opacity-50 dark:text-neutral-400",
            day_disabled: "text-neutral-500 opacity-50 dark:text-neutral-400",
            day_range_middle:
              "aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50",
            day_hidden: "invisible",
          }}
        />
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonth(new Date())}
            className="w-full text-xs"
          >
            Jump to Today
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default Calendar;
