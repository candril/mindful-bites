import { FC } from "react";
import { Sprout } from "lucide-react";
import { Link } from "wouter";

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Link href="~/">
          <button className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
            <Sprout size={24} />
          </button>
        </Link>
      </div>

      <div className="flex space-x-4">
        <Link
          href={`/calendar`}
          className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          Calendar
        </Link>
        <Link
          href={`/agenda`}
          className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          Agenda
        </Link>
        <Link
          href={`/stats`}
          className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          Stats
        </Link>
      </div>
    </header>
  );
};
