import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { EntryTile } from "./EntryTile";
import { Entry } from "@/data/useStorage";

export const EntryPicker: React.FC<{
  entries: Entry[];
  onAddClick: () => void;
  onEntryClick: (entry: Entry) => void;
  onRemoveClick: (entry: Entry) => void;
}> = ({ entries, onAddClick, onEntryClick, onRemoveClick }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4">
        {entries.map((m) => (
          <EntryTile
            key={m.id}
            entry={m}
            onDeleteClick={() => onRemoveClick(m)}
            onClick={() => onEntryClick(m)}
          />
        ))}
      </div>
      <Button
        variant="default"
        size="default"
        className="mt-6 w-full"
        onClick={onAddClick}
      >
        <Plus size={18} />
        Add New
      </Button>
    </div>
  );
};
