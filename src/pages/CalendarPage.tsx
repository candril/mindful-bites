import * as LucideIcons from "lucide-react";
import { Calendar } from "../components/Calendar";
import { Entry, useEntries } from "../data/useStorage";
import { FC, useCallback, useMemo, useState } from "react";
import { Dot } from "../components/Dot";
import { Day } from "../components/CalendarGrid";
import { Layout } from "@/components/Layout";
import { getEntryScore } from "@/data/getEntryScore";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { useLocation, useParams } from "wouter";
import { EditDrawer } from "./EditDrawer";
import { HeaderMenuProps } from "@/components/HeaderMenu";

const CalendarPage: FC = () => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [, navigate] = useLocation();

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
      ...(definitions?.length ? definitions : []).map((d) => {
        return {
          ...d,
          icon: d.iconName ? <DynamicIcon name={d.iconName} /> : null,
        };
      }),
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
        additionalContent={(day) =>
          getDayEntries(day).map((entry) => (
            <Dot key={entry.id} rating={getEntryScore(entry)} />
          ))
        }
      />

      <EditDrawer
        selectedDay={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </Layout>
  );
};

const DynamicIcon: FC<{ name?: string }> = ({ name }) => {
  if (name) {
    // @ts-expect-error invalid TS error
    const Icon = LucideIcons[name];
    return <Icon />;
  }

  return null;
};

export default CalendarPage;
