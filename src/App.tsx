import { addMonths, format, isSameDay, subMonths } from "date-fns";
import { Calendar } from "./components/Calendar";
import { useMeals } from "./data/useStorage";
import { useState } from "react";
import { getMealScore } from "./data/getMealScore";
import { Dot } from "./components/Dot";
import { BottomSheet } from "./components/BottomSheet";
import { getCommonComponents } from "./data/getCommonComponents";
import { MealForm } from "./components/MealForm";
import { MealPicker } from "./components/MealPicker";
import { Day } from "./components/CalendarGrid";
import { MealEntry } from "./data/meals";

function App() {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [showEntryPicker, setShowEntryPicker] = useState<boolean>(true);
  const [selectedMealEnty, setSelectedMealEntry] = useState<MealEntry | null>(
    null,
  );

  const handlePrevMonth = () => {
    setMonth(subMonths(month, 1));
  };

  const handleNextMonth = () => {
    setMonth(addMonths(month, 1));
  };

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

  const { entries, updateEntry, deleteEntry, createEntry } = useMeals();

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
        currentMonth={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onDayClick={handleDayClick}
        additionalContent={(day) =>
          getDayEntries(day.date).map((m) => (
            <Dot key={m.id} rating={getMealScore(m)} />
          ))
        }
      />

      <BottomSheet
        isOpen={selectedDay !== null}
        onClose={() => reset()}
        title={selectedDay && format(selectedDay.date, "EEEE, dd MMMM yyyy")}
      >
        {getSheetContent()}
      </BottomSheet>
    </div>
  );
}

export default App;
