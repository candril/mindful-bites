import { EntryDefinition } from "@/data/EntryDefinition";
import { FC, ReactNode } from "react";

export const DefinitionTile: FC<{
  definition: EntryDefinition;
  onClick: () => void;
  end?: ReactNode;
}> = ({ definition, onClick, end }) => (
  <div
    role="button"
    className="p-4 mb-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{definition.name}</h3>
        {definition.description && (
          <p className="text-sm text-gray-500 mt-1">{definition.description}</p>
        )}
      </div>
      {end && <div>{end}</div>}
    </div>
  </div>
);
