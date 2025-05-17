import { EntryDefinition } from "@/data/EntryDefinition";
import { FC } from "react";

export const DefinitionTile: FC<{
  definition: EntryDefinition;
  onClick: () => void;
}> = ({ definition, onClick }) => (
  <div
    role="button"
    className="p-4 mb-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-lg font-semibold">{definition.name}</h3>
    {definition.description && (
      <p className="text-sm text-gray-500 mt-1">{definition.description}</p>
    )}
  </div>
);
