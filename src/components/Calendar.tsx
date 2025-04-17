import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { CalendarGrid, Day } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { addMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarProps {
  startMonth: Date;
  onDayClick: (day: Day) => void;
  additionalContent?: (day: Day) => ReactNode;
}

export const Calendar: React.FC<CalendarProps> = ({
  startMonth,
  additionalContent,
  onDayClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { handleScroll, months, currentMonth, goBack, goForward } =
    useMonthList(startMonth, ref);

  return (
    <div
      className={cn(
        "bg-gray-50",
        "rounded-2xl",
        "sm:rounded-3xl",
        "shadow-xl",
        "overflow-hidden",
        "border",
        "border-gray-1",
      )}
    >
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
            key={m.toISOString()}
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

function useMonthList(startMonth: Date, ref: RefObject<HTMLDivElement | null>) {
  const [monthIndex, setMonthIndex] = useState<number>(9);
  const [months, setMonths] = useState<Date[]>(() => {
    const result = [
      ...getMoreMonths(startMonth, 8, -1),
      startMonth,
      ...getMoreMonths(startMonth, 2, 1),
    ];
    return result;
  });

  const currentMonth = months[monthIndex];

  const updateBlockedRef = useRef<boolean>(false);

  const handleScroll = () => {
    if (ref.current) {
      const scrollPosition = ref.current.scrollLeft;
      const containerWidth = ref.current.clientWidth;
      const visibleIndex = Math.round(scrollPosition / containerWidth);
      updateBlockedRef.current = true;

      setMonthIndex(visibleIndex);
      setTimeout(() => (updateBlockedRef.current = false), 200);
    }
  };

  const previousIndexRef = useRef(0);
  const previousMonthCountRef = useRef(months.length);

  useEffect(() => {
    if (ref.current) {
      if (
        previousIndexRef.current === monthIndex &&
        previousMonthCountRef.current !== months.length
      ) {
        ref.current.scrollLeft = 0;
      } else if (!updateBlockedRef.current) {
        ref.current.scrollLeft = monthIndex * ref.current.clientWidth;
      }
    }

    previousIndexRef.current = monthIndex;
    previousMonthCountRef.current = months.length;
  }, [months.length, monthIndex]);

  return {
    handleScroll,
    currentMonth,
    months,
    goBack: () => {
      if (monthIndex === 0) {
        setMonths([...getMoreMonths(months[0], 1, -1), ...months]);
      } else {
        setMonthIndex(monthIndex - 1);
      }
    },
    goForward: () => {
      if (monthIndex === months.length - 1) {
        setMonths([
          ...months,
          ...getMoreMonths(months[months.length - 1], 1, 1),
        ]);
      }
      setMonthIndex(monthIndex + 1);
    },
  };
}

function getMoreMonths(start: Date, count: number, delta: number): Date[] {
  const items = [];
  for (let i = 0; i <= count; i++) {
    items[i] = addMonths(start, delta * (i + 1));
  }

  return delta < 0 ? items.reverse() : items;
}
