import { Day } from "@/components/CalendarGrid";
import { EntryPicker } from "@/components/EntryPicker";
import { EntryForm } from "@/components/form/EntryForm";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { NewEntryDrawer } from "@/components/NewEntryDrawer";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Drawer,
} from "@/components/ui/drawer";
import { Entry, useEntries } from "@/data/useStorage";
import { format } from "date-fns/format";
import { isSameDay } from "date-fns/isSameDay";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { useParams } from "wouter";

export const EditDrawer: FC<{
  selectedDay: Day | null;
  onClose: () => void;
}> = ({ selectedDay, onClose }) => {
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

  const definition = definitions?.find((d) => d.id === definitionId);

  function reset() {
    setSelectedEntry(null);
    setShowEntryPicker(true);
    onClose();
  }

  if (selectedDay == null) {
    return null;
  }

  if (selectedEntry || (showEntryPicker && dayEntries.length)) {
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
  }

  return (
    <NewEntryDrawer
      isOpen={selectedDay != null}
      date={selectedDay.date}
      onOpenChange={(open) => !open && reset()}
    />
  );

  function getContent() {
    if (!definition) {
      return null;
    }

    if (selectedEntry) {
      return (
        <EntryForm
          entry={selectedEntry}
          definition={definition}
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
