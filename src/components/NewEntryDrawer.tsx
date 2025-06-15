import { Entry, useEntries } from "@/data/useStorage";
import { NewEntryForm } from "@/pages/NewEntryForm";
import { ArrowRight, X } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { useEntryDefinitions } from "./form/useFieldDefinitions";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { DefinitionTile } from "./DefinitionTile";
import { EntryDefinition } from "@/data/EntryDefinition";
import { createDefaultEntry } from "@/data/createDefaultEntry";
import { useToken } from "./AuthenticationContext";

export const NewEntryDrawer: FC<{
  date: Date;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ isOpen, date, onOpenChange }) => {
  const token = useToken();
  const { createEntry } = useEntries();

  const { definitions } = useEntryDefinitions();
  const [selectedDefinitionId, setSelectedDefinition] = useState<string | null>(
    null,
  );

  function reset() {
    onOpenChange(false);
    setSelectedDefinition(null);
  }

  const definitionCount = definitions?.length ?? 0;

  const definitionId =
    definitionCount === 1 ? definitions?.[0].id : selectedDefinitionId;

  async function handleDefinitionClick(definition: EntryDefinition) {
    const fieldCount = definition?.fields?.length ?? 0;
    if (fieldCount > 0) {
      setSelectedDefinition(definition.id);
    } else {
      const defaultEntry = createDefaultEntry(date, token, definition);
      await handleCreateEntry(defaultEntry);
    }
  }

  async function handleCreateEntry(entry: Entry) {
    try {
      reset();
      await createEntry(entry);
      return true;
    } catch {
      toast.error("Ooops, the entry could not be stored");
      return false;
    }
  }
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && reset()}>
      <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
        <DrawerHeader className="flex flex-row p-0">
          <DrawerTitle className="flex-1 self-center justify-center text-3xl">
            Create Entry
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
        <div className="overflow-auto">
          {!definitionId &&
            definitions?.map((d) => (
              <DefinitionTile
                key={d.id}
                definition={d}
                onClick={async () => await handleDefinitionClick(d)}
                end={d.fields.length > 0 && <ArrowRight />}
              />
            ))}

          {definitionId && (
            <NewEntryForm
              definitionId={definitionId}
              date={date}
              onSubmit={handleCreateEntry}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
