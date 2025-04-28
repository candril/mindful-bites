import { FC, ReactNode } from "react";
import { Link, useRoute } from "wouter";
import {
  Calendar,
  ClipboardList,
  BarChart3,
  PlusCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav: FC<{ onAddClick: () => void }> = ({ onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-md px-2 py-2">
      <div className="flex items-center justify-around">
        <NavItem
          href="/calendar"
          icon={<Calendar size={24} />}
          label="Calendar"
        />

        <NavItem
          href="/agenda"
          icon={<ClipboardList size={24} />}
          label="Agenda"
        />

        <button
          onClick={onAddClick}
          className={cn(
            "flex",
            "flex-col",
            "items-center",
            "justify-center",
            "p-3",
            "rounded-full",
            "bg-green-600",
            "text-white",
            "hover:bg-green-700",
            "transition-colors",
            "-mt-12",
            "shadow-lg",
          )}
        >
          <PlusCircle size={30} />
        </button>
        <NavItem href="/stats" icon={<BarChart3 size={24} />} label="Stats" />
        <NavItem href="/about" icon={<Info size={24} />} label="About" />
      </div>
    </nav>
  );
};

type NavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

const NavItem: FC<NavItemProps> = ({ href, icon, label }) => {
  const [isActive] = useRoute(href);

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (isActive) {
          e.preventDefault();
          window.location.reload();
        }
      }}
    >
      <button
        className={cn(
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "w-20",
          "p-2",
          "rounded-md",
          "hover:bg-gray-100",
          "transition-colors",

          isActive && "text-green-600",
        )}
      >
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </button>
    </Link>
  );
};
