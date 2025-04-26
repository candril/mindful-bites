import { useMeals } from "../data/useStorage";
import { FC, useEffect } from "react";
import { useParams } from "wouter";
import { useUserInfo } from "@/data/useUserInfo";
import { MealTile } from "@/components/MealTile";
import { MEAL_TYPE_MAP, MealEntry } from "@/data/meals";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { useToken } from "@/components/AuthenticationContext";

const AgendaPage: FC = () => {
  const token = useToken();
  const { entries } = useMeals(token);

  const entriesByYearMonthDay = groupByYearMonthDay(entries);

  const sortedYears = Object.keys(entriesByYearMonthDay).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <Layout>
      {sortedYears.map((year) => {
        const monthsInYear = entriesByYearMonthDay[year];
        const sortedMonths = Object.keys(monthsInYear).sort(
          (a, b) => Number(b) - Number(a),
        );

        return sortedMonths.map((month) => {
          const daysInMonth = monthsInYear[month];
          const sortedDays = Object.keys(daysInMonth).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime(),
          );

          const monthName = format(new Date(sortedDays[0]), "MMMM yyyy");

          return (
            <div key={`${year}-${month}`} className="mb-6">
              <h2 className="text-2xl font-bold py-2 sticky top-0 bg-white">
                {monthName}
              </h2>

              {sortedDays.map((day) => (
                <div key={day} className="mb-4">
                  <h3 className="text-xl font-semibold py-1 top-10 bg-white">
                    {format(new Date(day), "EEEE, dd")}
                  </h3>
                  <div>
                    {daysInMonth[day]
                      .sort(
                        (a, b) =>
                          MEAL_TYPE_MAP[a.mealType].order -
                          MEAL_TYPE_MAP[b.mealType].order,
                      )
                      .map((meal) => (
                        <MealTile key={meal.id} meal={meal} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          );
        });
      })}
    </Layout>
  );
};

export default AgendaPage;

function groupByYearMonthDay(entries: MealEntry[]) {
  return entries.reduce<
    Record<string, Record<string, Record<string, MealEntry[]>>>
  >((years, meal) => {
    const date = new Date(meal.date);
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = meal.date;

    if (!years[year]) years[year] = {};
    if (!years[year][month]) years[year][month] = {};
    if (!years[year][month][day]) years[year][month][day] = [];

    years[year][month][day].push(meal);
    return years;
  }, {});
}
