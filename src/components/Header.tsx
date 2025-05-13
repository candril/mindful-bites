import { FC, useEffect, useRef, useState } from "react";
import { Sprout } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

import { ChevronDown } from "lucide-react";

export interface DropdownItem {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  placeholder?: string;
}

export const DropdownMenu: FC<DropdownMenuProps & HeaderMenu> = ({
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex justify-end items-center w-full p-3",
          "bg-white",
          "transition-all duration-200",
        )}
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

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onItemChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "p-3 cursor-pointer hover:bg-gray-100",
                item.id === selectedMenuItem && "bg-gray-50",
              )}
            >
              <div className="flex items-center">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export type HeaderMenu = {
  selectedMenuItem?: string;
  menuItems: DropdownItem[];
  onItemChange: (key: string) => void;
};

export const Header: FC<{
  title?: string;
  menu?: HeaderMenu;
}> = ({ title, menu }) => {
  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "z-10",
        "bg-white/80",
        "backdrop-blur-md",
        "shadow-sm",
        "px-4",
        "py-3",
        "flex",
        "items-center",
        "justify-between",
      )}
    >
      <div className="flex items-center space-x-2">
        <Link href="~/">
          <button
            className={cn(
              "inline-flex",
              "items-center",
              "justify-center",
              "p-2",
              "rounded-full",
              "bg-gradient-to-br",
              "from-green-400",
              "to-green-600",
              "text-white",
              "shadow-md",
              "hover:shadow-lg",
              "transition-all",
              "duration-200",
              "hover:scale-105",
            )}
          >
            <Sprout size={24} />
          </button>
        </Link>

        <h1 className="ml-1 text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      {menu && (
        <div className="w-64">
          <DropdownMenu
            menuItems={menu.menuItems}
            selectedMenuItem={menu.selectedMenuItem}
            onItemChange={menu.onItemChange}
            placeholder="Select an option"
          />
        </div>
      )}
    </header>
  );
};
