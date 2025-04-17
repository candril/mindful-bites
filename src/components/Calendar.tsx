import { ReactNode, useEffect, useRef, useState } from "react";
import { CalendarGrid, Day } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { addMonths } from "date-fns";

interface CalendarProps {
  startMonth: Date;
  onDayClick: (day: Day) => void;
  additionalContent?: (day: Day) => ReactNode;
}

function useMonthList(startMonth: Date) {
  const [monthIndex, setMonthIndex] = useState<number>(2);
  const [months, setMonths] = useState<Date[]>(() => [
    addMonths(startMonth, -2),
    addMonths(startMonth, -1),
    startMonth,
    addMonths(startMonth, 1),
    addMonths(startMonth, 2),
  ]);

  const currentMonth = months[monthIndex];

  return {
    currentMonth,
    months,
    monthIndex,
    setMonthIndex,
    goBack: () => {
      if (monthIndex === 0) {
        setMonths([addMonths(months[0], -1), ...months]);
      } else {
        setMonthIndex(monthIndex - 1);
      }
    },
    goForward: () => {
      if (monthIndex === months.length - 1) {
        setMonths([...months, addMonths(months[months.length - 1], 1)]);
      } else {
        setMonthIndex(monthIndex + 1);
      }
    },
  };
}

export const Calendar: React.FC<CalendarProps> = ({
  startMonth,
  additionalContent,
  onDayClick,
}) => {
  const { months, monthIndex, setMonthIndex, currentMonth, goBack, goForward } =
    useMonthList(startMonth);

  const ref = useRef<HTMLDivElement>(null);
  const refBlock = useRef<boolean>(false);

  const handleScroll = () => {
    if (ref.current) {
      const scrollPosition = ref.current.scrollLeft;
      const containerWidth = ref.current.clientWidth;
      const visibleIndex = Math.round(scrollPosition / containerWidth);
      refBlock.current = true;
      setMonthIndex(visibleIndex);
      setTimeout(() => (refBlock.current = false), 200);
    }
  };

  useEffect(() => {
    if (ref.current && !refBlock.current) {
      ref.current.scrollLeft = monthIndex * ref.current.clientWidth;
    }
  }, [monthIndex]);

  return (
    <div className="bg-gray-50 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-1">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={goBack}
        onNextMonth={goForward}
      />

      <div
        ref={ref}
        className="flex snap-x snap-mandatory overflow-x-auto"
        onScroll={handleScroll}
      >
        {months.map((m) => (
          <CalendarGrid
            key={m.getTime()}
            className="shrink-0 w-screen snap-center snap-always"
            currentMonth={m}
            onDayClick={onDayClick}
            additionalContent={additionalContent}
          />
        ))}
      </div>
    </div>
  );
};
