import { FC } from "react";
import { Sprout } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { HeaderMenu, HeaderMenuProps } from "./HeaderMenu";

export const Header: FC<{
  title?: string;
  menu?: HeaderMenuProps;
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
          <HeaderMenu
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
