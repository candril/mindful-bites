import { FC } from "react";
import { Link } from "wouter";
import { Calendar, ClipboardList, BarChart3 } from "lucide-react";

export const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-md px-2 py-2">
      <div className="flex items-center justify-around">
        <Link href="/calendar">
          <button className="flex flex-col items-center justify-center w-20 p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Calendar size={24} />
            <span className="text-xs mt-1">Calendar</span>
          </button>
        </Link>

        <Link href="/agenda">
          <button className="flex flex-col items-center justify-center w-20 p-2 rounded-md hover:bg-gray-100 transition-colors">
            <ClipboardList size={24} />
            <span className="text-xs mt-1">Agenda</span>
          </button>
        </Link>

        <Link href="/stats">
          <button className="flex flex-col items-center justify-center w-20 p-2 rounded-md hover:bg-gray-100 transition-colors">
            <BarChart3 size={24} />
            <span className="text-xs mt-1">Stats</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};
