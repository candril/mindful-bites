import { format, isSameDay } from "date-fns";
import { Calendar } from "../components/Calendar";
import { useMeals } from "../data/useStorage";
import { FC, useEffect, useState } from "react";
import { getMealScore } from "../data/getMealScore";
import { Dot } from "../components/Dot";
import { getCommonComponents } from "../data/getCommonComponents";
import { MealForm } from "../components/MealForm";
import { MealPicker } from "../components/MealPicker";
import { Day } from "../components/CalendarGrid";
import { MealEntry } from "../data/meals";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import { useParams } from "wouter";
import { useUserInfo } from "@/data/useUserInfo";

function CalendarPage() {
  const { token } = useParams();
  const { setUserToken, user } = useUserInfo();

  useEffect(() => {
    if (token && token !== user?.token) {
      setUserToken(token);
    }
  }, [setUserToken, token, user, user?.token]);

  if (!token) {
    return <div>Missing Token</div>;
  }

  return <CalendarPageInternal token={token} />;
}

const CalendarPageInternal: FC<{ token: string }> = ({ token }) => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [showEntryPicker, setShowEntryPicker] = useState<boolean>(true);
  const [selectedMealEnty, setSelectedMealEntry] = useState<MealEntry | null>(
    null,
  );

  const handleDayClick = (day: Day) => {
    setSelectedDay(day);
  };

  const reset = () => {
    setShowEntryPicker(true);
    setSelectedDay(null);
    setSelectedMealEntry(null);
  };

  const getDayEntries = (date: Date) =>
    entries.filter((e) => isSameDay(e.date, date));

  const { entries, updateEntry, deleteEntry, createEntry } = useMeals(token);

  const dayEntries = selectedDay ? getDayEntries(selectedDay.date) : [];

  const getSheetContent = () => {
    const commonComponents = getCommonComponents(entries);
    if (selectedMealEnty) {
      return (
        <MealForm
          entry={selectedMealEnty}
          commonComponents={commonComponents}
          date={selectedMealEnty.date}
          onSubmit={(entry) => {
            updateEntry(entry);
            reset();
          }}
        />
      );
    }

    if (dayEntries.length && showEntryPicker) {
      return (
        <MealPicker
          meals={dayEntries}
          onAddClick={() => setShowEntryPicker(false)}
          onEntryClick={(entry) => setSelectedMealEntry(entry)}
          onRemoveClick={(entry) => deleteEntry(entry.id)}
        />
      );
    }

    if (selectedDay) {
      return (
        <MealForm
          date={selectedDay.date}
          commonComponents={commonComponents}
          onSubmit={(entry) => {
            createEntry(entry);
            reset();
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-svh">
      <Calendar
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
    </div>
  );
};

export default CalendarPage;
