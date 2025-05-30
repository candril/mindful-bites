import { addDays } from "date-fns/addDays";
import { endOfMonth } from "date-fns/endOfMonth";
import { format } from "date-fns/format";
import { getDay } from "date-fns/getDay";
import { isBefore } from "date-fns/isBefore";
import { isSameMonth } from "date-fns/isSameMonth";
import { isToday } from "date-fns/isToday";
import { startOfMonth } from "date-fns/startOfMonth";
import { subDays } from "date-fns/subDays";
import { forwardRef, ReactNode } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDaysMobile = ["M", "T", "W", "T", "F", "S", "S"];

interface CalendarGridProps {
  className?: string;
  currentMonth: Date;
  additionalContent?: (day: Day) => ReactNode;
  onDayClick: (day: Day) => void;
}

export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  ({ className, currentMonth, onDayClick, additionalContent }, ref) => {
    const days = [...getCalendarDays(currentMonth)];
    return (
      <div ref={ref} className={className}>
        <div className="grid grid-cols-7 gap-1 sm:gap-4 px-2 sm:px-6 py-2 sm:py-4">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-gray-500"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{weekDaysMobile[index]}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="grid grid-cols-7 gap-1 sm:gap-4 px-2 sm:px-6 pb-4 sm:pb-6">
            {days.map((day) => (
              <button
                key={day.date.getTime()}
                onClick={() => onDayClick(day)}
                className={`relative flex flex-col group min-h-[60px] sm:min-h-[120px] rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all ${
                  day.isCurrentMonth
                    ? "bg-white hover:shadow-lg hover:scale-[1.02] border border-gray-100"
                    : "bg-gray-50"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium ${
                    day.isToday
                      ? "bg-primary text-white"
                      : day.isCurrentMonth
                        ? "text-gray-900"
                        : "text-gray-400"
                  }`}
                >
                  {day.date.getDate()}
                </span>
                <div className="flex-1 flex flex-wrap items-end space-x-1">
                  <>{additionalContent && additionalContent(day)}</>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

export type Day = {
  isToday: boolean;
  isCurrentMonth: boolean;
  dateString: string;
  date: Date;
};

function* getCalendarDays(month: Date): Generator<Day, void, unknown> {
  const firstDayOfMonth = startOfMonth(month);
  const lastDayOfMonth = endOfMonth(month);

  const startWeekDay = getDay(firstDayOfMonth);
  const endWeekDay = getDay(lastDayOfMonth);

  const firstDayInView = subDays(firstDayOfMonth, startWeekDay - 1);
  const lastDayInView =
    endWeekDay === 0
      ? lastDayOfMonth
      : addDays(lastDayOfMonth, 6 - endWeekDay + 1);

  let date = firstDayInView;
  while (isBefore(date, lastDayInView)) {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );

    yield {
      date: utcDate,
      dateString: format(utcDate, "yyyy-MM-dd"),
      isCurrentMonth: isSameMonth(date, month),
      isToday: isToday(date),
    };

    date = addDays(date, 1);
  }
}
