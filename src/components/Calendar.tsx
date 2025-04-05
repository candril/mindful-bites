import { ReactNode } from "react";
import { CalendarGrid, Day } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";

interface CalendarProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (day: Day) => void;
  additionalContent?: (day: Day) => ReactNode;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  additionalContent,
  onPrevMonth,
  onNextMonth,
  onDayClick,
}) => {
  return (
    <div className="bg-gray-50 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-1">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <CalendarGrid
        currentMonth={currentMonth}
        onDayClick={onDayClick}
        additionalContent={additionalContent}
      />
    </div>
  );
};
