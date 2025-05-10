import { format, isSameDay } from "date-fns";
import { Calendar } from "../components/Calendar";
import { Entry, useEntries } from "../data/useStorage";
import { FC, useState } from "react";
import { getMealScore } from "../data/getMealScore";
import { Dot } from "../components/Dot";
import { EntryForm } from "../components/form/EntryForm";
import { Day } from "../components/CalendarGrid";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";
import { EntryPicker } from "@/components/EntryPicker";
import { NewEntryForm } from "./NewEntryForm";

const CalendarPage: FC = () => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [showEntryPicker, setShowEntryPicker] = useState<boolean>(true);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const handleDayClick = (day: Day) => {
    setSelectedDay(day);
  };

  const reset = () => {
    setShowEntryPicker(true);
    setSelectedDay(null);
    setSelectedEntry(null);
  };

  const getDayEntries = (date: Date) =>
    entries.filter((e) => isSameDay(e.date, date));

  const { entries, updateEntry, deleteEntry, createEntry } = useEntries();

  const dayEntries = selectedDay ? getDayEntries(selectedDay.date) : [];

  const getSheetContent = () => {
    if (selectedEntry) {
      return (
        <EntryForm
          entry={selectedEntry}
          onSubmit={async (entry: Entry) => {
            try {
              reset();
              await updateEntry(entry);
              return true;
            } catch {
              toast.error("Oops, entry could not be stored!");
              return false;
            }
          }}
        />
      );
    }

    if (dayEntries.length && showEntryPicker) {
      return (
        <EntryPicker
          entries={dayEntries}
          onAddClick={() => setShowEntryPicker(false)}
          onEntryClick={(entry) => setSelectedEntry(entry)}
          onRemoveClick={async (entry) => {
            try {
              await deleteEntry(entry.id);
            } catch {
              toast.error("Ooops, could not delete the entry");
            }
          }}
        />
      );
    }

    if (selectedDay) {
      return (
        <NewEntryForm
          date={selectedDay.date}
          onSubmit={async (entry) => {
            try {
              reset();
              await createEntry(entry);
              return true;
            } catch {
              toast.error("Oops, entry could not be stored!");
              return false;
            }
          }}
        />
      );
    }

    return null;
  };

  return (
    <Layout title="Calendar">
      <Calendar
        className="flex-1"
        startMonth={new Date()}
        onDayClick={handleDayClick}
        additionalContent={(day) =>
          getDayEntries(day.date).map((m) => (
            <Dot key={m.id} rating={getMealScore(m)} />
          ))
        }
      />

      <Drawer
        open={selectedDay !== null}
        onOpenChange={(open) => !open && reset()}
      >
        <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
          <DrawerHeader className="flex flex-row p-0">
            <DrawerTitle className="flex-1 self-center justify-center text-3xl">
              {selectedDay && format(selectedDay.date, "EEEE, dd MMMM yyyy")}
            </DrawerTitle>
            <Button
              size="icon"
              variant="outline"
              onClick={reset}
              className="shadow-none border-none"
            >
              <X className="size-4" />
            </Button>
          </DrawerHeader>
          <div className="overflow-auto">{getSheetContent()}</div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default CalendarPage;
