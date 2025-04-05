import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-white border-b border-gray-100">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
        {format(currentMonth, "LLLL yyyy")}
      </h2>
      <div className="flex space-x-2 sm:space-x-3">
        <button
          onClick={onPrevMonth}
          className="p-2 sm:p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 sm:p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
