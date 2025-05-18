import { format, isSameDay } from "date-fns";
import { Calendar } from "../components/Calendar";
import { Entry, useEntries } from "../data/useStorage";
import { FC, useState } from "react";
import { Dot } from "../components/Dot";
import { EntryForm } from "../components/form/EntryForm";
import { Day } from "../components/CalendarGrid";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";
import { EntryPicker } from "@/components/EntryPicker";
import { getEnryScore } from "@/data/getEntryScore";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { useLocation, useParams } from "wouter";
import { EntryDefinition } from "@/data/EntryDefinition";
import { NewEntryDrawer } from "@/components/NewEntryDrawer";

const CalendarPage: FC = () => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [definitionIdForCreation, setDefinitionIdForCreation] = useState<
    string | null
  >(null);
  const [, navigate] = useLocation();

  const handleDayClick = (day: Day) => {
    setSelectedDay(day);
  };

  const reset = () => {
    setSelectedDay(null);
    setDefinitionIdForCreation(null);
  };

  const getDayEntries = (date: Date) =>
    filteredEntries.filter((e) => isSameDay(e.date, date));

  const definitions = useEntryDefinitions();

  const { definitionId: definitionIdFromParams } = useParams();
  const { entries } = useEntries();

  const definitionCount = definitions?.length ?? 0;

  const definitionId =
    definitionCount === 1 ? definitions?.[0].id : definitionIdFromParams;

  const filteredEntries = !definitionId
    ? entries
    : entries.filter((e) => e.definitionId === definitionId);

  const definition = definitions?.find((d) => d.id === definitionIdForCreation);

  const headerMenu = {
    menuItems: [
      { id: "all", name: "All", description: "Show all entry types" },
      ...(definitions?.length ? definitions : []),
    ],
    selectedMenuItem: definitionId ?? "all",
    onItemChange: (key: string) =>
      key === "all" ? navigate("/calendar") : navigate("/calendar/" + key),
  };

  return (
    <Layout
      title="Calendar"
      menu={definitionCount > 1 ? headerMenu : undefined}
    >
      <Calendar
        className="flex-1"
        startMonth={new Date()}
        onDayClick={handleDayClick}
        additionalContent={(day) =>
          getDayEntries(day.date).map((entry) => (
            <Dot key={entry.id} rating={getEnryScore(entry)} />
          ))
        }
      />

      <EditDrawer
        selectedDay={selectedDay}
        definition={definition}
        onClose={reset}
      />
    </Layout>
  );
};

export default CalendarPage;

const EditDrawer: FC<{
  selectedDay: Day | null;
  definition: EntryDefinition | undefined;
  onClose: () => void;
}> = ({ selectedDay, definition, onClose }) => {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [showEntryPicker, setShowEntryPicker] = useState<boolean>(true);

  const getDayEntries = (date: Date) =>
    filteredEntries.filter((e) => isSameDay(e.date, date));

  const definitions = useEntryDefinitions();

  const { definitionId: definitionIdFromParams } = useParams();
  const { entries, updateEntry, deleteEntry } = useEntries();

  const definitionCount = definitions?.length ?? 0;

  const definitionId =
    definitionCount === 1 ? definitions?.[0].id : definitionIdFromParams;

  const filteredEntries = !definitionId
    ? entries
    : entries.filter((e) => e.definitionId === definitionId);

  const dayEntries = selectedDay ? getDayEntries(selectedDay.date) : [];

  function reset() {
    setSelectedEntry(null);
    setShowEntryPicker(true);
    onClose();
  }

  if (selectedDay != null && !selectedEntry && dayEntries.length === 0) {
    return (
      <NewEntryDrawer
        isOpen={selectedDay != null}
        date={selectedDay.date}
        onOpenChange={(open) => !open && reset()}
      />
    );
  }

  return (
    <Drawer
      open={selectedDay !== null}
      onOpenChange={(open) => !open && reset()}
    >
      <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
        <DrawerHeader className="flex p-0">
          <div className="flex flex-row">
            <DrawerTitle className="flex-1 self-center justify-center text-3xl">
              {definition && `New ${definition.name}`}
            </DrawerTitle>
            <Button
              size="icon"
              variant="outline"
              onClick={reset}
              className="shadow-none border-none"
            >
              <X className="size-4" />
            </Button>
          </div>

          <DrawerDescription>
            {selectedDay && format(selectedDay.date, "EEEE, dd MMMM yyyy")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-auto">{getContent()}</div>
      </DrawerContent>
    </Drawer>
  );

  function getContent() {
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
              reset();
              await deleteEntry(entry.id);
            } catch {
              toast.error("Ooops, could not delete the entry");
            }
          }}
        />
      );
    }

    return null;
  }
};
