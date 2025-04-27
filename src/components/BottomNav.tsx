import { FC, ReactNode } from "react";
import { Link, useRoute } from "wouter";
import { Calendar, ClipboardList, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav: FC = () => {
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
        <NavItem href="/stats" icon={<BarChart3 size={24} />} label="Stats" />
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
    <Link href={href}>
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
