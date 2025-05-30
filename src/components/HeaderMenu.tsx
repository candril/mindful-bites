import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

export interface HeaderMenuItem {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export type HeaderMenuProps = {
  selectedMenuItem?: string;
  menuItems: HeaderMenuItem[];
  onItemChange: (key: string) => void;
  placeholder?: string;
};

export const HeaderMenu: FC<HeaderMenuProps> = ({
  menuItems,
  selectedMenuItem,
  onItemChange,
  placeholder = "Select an item",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItem = menuItems.find((item) => item.id === selectedMenuItem);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <h1>I'm the head</h1>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex justify-end items-center w-full p-3 gap-2",
          "bg-white hover:bg-gray-50",
          "transition-all duration-200 ease-in-out",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <div>
            <span className="font-medium">
              {selectedItem ? selectedItem.name : placeholder}
            </span>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>

      <div
        className={cn(
          "absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg",
          "max-h-100 overflow-y-auto origin-top",
          "transition-all duration-200 ease-in-out",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[-10px] pointer-events-none",
        )}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onItemChange(item.id);
              setIsOpen(false);
            }}
            className={cn(
              "p-3 cursor-pointer hover:bg-gray-100",
              "transition-colors duration-150 ease-in-out",
              item.id === selectedMenuItem && "bg-gray-50",
            )}
          >
            <div className="flex flex-row items-center space-x-3">
              <div>{item.icon ? item.icon : <div className="w-6"></div>}</div>
              <div className="flex items-center">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
