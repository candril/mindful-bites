import React from "react";
import { X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ComponentPickerProps {
  components: string[];
  commonComponents: string[];
  onAdd: (component: string) => void;
  onRemove: (component: string) => void;
}

export function ComponentPicker({
  components,
  commonComponents,
  onAdd,
  onRemove,
}: ComponentPickerProps) {
  const [newComponent, setNewComponent] = React.useState("");

  const handleAdd = (component: string) => {
    onAdd(component);
    setNewComponent("");
  };

  // Combine common components with custom components for display
  const allComponents = [...new Set([...commonComponents, ...components])];

  const filterValue = newComponent.toLocaleLowerCase();
  const componentsValue = allComponents
    .map((c) => ({ name: c, isSelected: components.includes(c) }))
    .filter(
      (c) =>
        c.isSelected ||
        newComponent?.length === 0 ||
        c.name.toLocaleLowerCase().includes(filterValue),
    )
    .sort((component) => {
      return component.isSelected ? -1 : 1;
    })
    .slice(0, 15);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={newComponent}
            onChange={(e) => setNewComponent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (newComponent) handleAdd(newComponent);
              }
            }}
            className="w-full rounded-lg p-3 pr-8 border-gray-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add custom meal..."
          />
          {newComponent && (
            <button
              type="button"
              onClick={() => setNewComponent("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          onClick={(event) => {
            event.preventDefault();
            return newComponent && handleAdd(newComponent);
          }}
          variant="outline"
        >
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {componentsValue.map((component) => {
          const { isSelected, name } = component;
          return (
            <button
              key={name}
              type="button"
              onClick={() => (isSelected ? onRemove(name) : handleAdd(name))}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
            >
              <span className="relative w-3.5 h-3.5">
                <X
                  className={`absolute inset-0 h-3.5 w-3.5 transition-all duration-200
                    ${
                      isSelected
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-75"
                    }`}
                />
                <Plus
                  className={`absolute inset-0 h-3.5 w-3.5 transition-all duration-200
                    ${
                      isSelected
                        ? "opacity-0 -rotate-90 scale-75"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                />
              </span>
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
