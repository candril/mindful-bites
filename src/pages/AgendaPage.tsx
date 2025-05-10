import { FC, useState } from "react";
import { EntryTile } from "@/components/EntryTile";
import { MEAL_TYPE_MAP } from "@/data/meals";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EntryForm } from "@/components/EntryForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Entry, useEntries } from "@/data/useStorage";

const AgendaPage: FC = () => {
  const { entries, updateEntry } = useEntries();

  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const entriesByYearMonthDay = groupByYearMonthDay(entries);

  const sortedYears = Object.keys(entriesByYearMonthDay).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <Layout title="Agenda">
      {sortedYears.map((year) => {
        const monthsInYear = entriesByYearMonthDay[year];
        const sortedMonths = Object.keys(monthsInYear).sort(
          (a, b) => Number(b) - Number(a),
        );

        return sortedMonths.map((month) => {
          const daysInMonth = monthsInYear[month];
          const sortedDays = Object.keys(daysInMonth).sort(
            (a, b) => Number(b) - Number(a),
          );
          const monthName = format(
            new Date(Number(year), Number(month), 1),
            "MMMM yyyy",
          );

          return (
            <div key={`${year}-${month}`} className="mb-6">
              <h2 className="text-lg font-semibold py-2 px-3 sticky top-16 bg-white/90 text-gray-700 border-b border-gray-200 backdrop-blur-sm mb-3">
                {monthName}
              </h2>

              {sortedDays.map((day) => (
                <div key={day} className="mb-4 m-3">
                  <h3 className="text-sm font-medium mb-2">
                    {format(
                      new Date(Number(year), Number(month), Number(day)),
                      "EEEE, dd.MM.",
                    )}
                  </h3>
                  <div className="space-y-3">
                    {daysInMonth[day]
                      .sort(
                        (a, b) =>
                          MEAL_TYPE_MAP[a.data.mealType].order -
                          MEAL_TYPE_MAP[b.data.mealType].order,
                      )
                      .map((meal) => (
                        <EntryTile
                          key={meal.id}
                          meal={meal}
                          onClick={() => setSelectedEntry(meal)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          );
        });
      })}

      <Drawer
        open={selectedEntry != null}
        onOpenChange={(open) => !open && setSelectedEntry(null)}
      >
        <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
          <DrawerHeader className="flex flex-row p-0">
            <DrawerTitle className="flex-1 self-center justify-center text-3xl">
              Update Meal Entry
            </DrawerTitle>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setSelectedEntry(null)}
              className="shadow-none border-none"
            >
              <X className="size-4" />
            </Button>
          </DrawerHeader>
          <div className="overflow-auto">
            {selectedEntry && (
              <EntryForm
                entry={selectedEntry}
                onSubmit={async (entry) => {
                  try {
                    setSelectedEntry(null);
                    await updateEntry(entry);
                    return true;
                  } catch {
                    toast.error("Ooops, the meal could not be stored");
                    return false;
                  }
                }}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default AgendaPage;

function groupByYearMonthDay(entries: Entry[]) {
  return entries.reduce<
    Record<string, Record<string, Record<string, Entry[]>>>
  >((years, meal) => {
    const date = new Date(meal.date);
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate();

    if (!years[year]) years[year] = {};
    if (!years[year][month]) years[year][month] = {};
    if (!years[year][month][day]) years[year][month][day] = [];

    years[year][month][day].push(meal);
    return years;
  }, {});
}
