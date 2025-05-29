import { Calendar } from "../components/Calendar";
import { Entry, useEntries } from "../data/useStorage";
import { FC, useCallback, useMemo, useState } from "react";
import { Dot } from "../components/Dot";
import { Day } from "../components/CalendarGrid";
import { Layout } from "@/components/Layout";
import { getEntryRating, getEntryScore, getRating } from "@/data/getEntryScore";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { useLocation, useParams } from "wouter";
import { EditDrawer } from "./EditDrawer";
import { HeaderMenuProps } from "@/components/HeaderMenu";
import { usePreviewFeature } from "@/data/useSetPreviewFeature";

const CalendarPage: FC = () => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [, navigate] = useLocation();

  const showCombinedRatings = usePreviewFeature("combined-rating");

  const definitions = useEntryDefinitions();

  const { definitionId: definitionIdFromParams } = useParams();
  const { entries } = useEntries();

  const definitionCount = definitions?.length ?? 0;

  const definitionId =
    definitionCount === 1 ? definitions?.[0].id : definitionIdFromParams;

  const entriesByDay = useMemo(
    () =>
      entries.reduce((result, next) => {
        const list = result.get(next.date);
        if (list) {
          list.push(next);
        } else {
          result.set(next.date, [next]);
        }
        return result;
      }, new Map<string, Entry[]>()),
    [entries],
  );

  const getDayEntries = useCallback(
    (day: Day) => {
      const dayEntries = entriesByDay.get(day.dateString) ?? [];
      return dayEntries.filter(
        (e) => definitionId == null || e.definitionId === definitionId,
      );
    },
    [definitionId, entriesByDay],
  );

  const headerMenu: HeaderMenuProps = {
    menuItems: [
      { id: "all", name: "All", description: "Show all entry types" },
      ...(definitions?.length ? definitions : []),
    ],
    selectedMenuItem: definitionId ?? "all",
    onItemChange: (key: string) =>
      key === "all" ? navigate("/calendar") : navigate("/calendar/" + key),
  };

  return (
    <Layout
      title="Calendar"
      menu={definitionCount > 1 ? headerMenu : undefined}
    >
      <Calendar
        className="flex-1"
        startMonth={new Date()}
        onDayClick={(day) => setSelectedDay(day)}
        additionalContent={(day) => {
          if (definitionId != null || !showCombinedRatings) {
            return getDayEntries(day).map((entry) => (
              <Dot key={entry.id} rating={getEntryRating(entry)} />
            ));
          } else {
            const entries = getDayEntries(day);
            if (entries.length) {
              const total = entries
                .map(getEntryScore)
                .reduce((total, num) => total + num, 0);
              const avg = total / entries.length;
              return <Dot rating={getRating(avg)}></Dot>;
            }

            return null;
          }
        }}
      />

      <EditDrawer
        selectedDay={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </Layout>
  );
};

export default CalendarPage;
