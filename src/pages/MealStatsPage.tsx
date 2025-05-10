import { Layout } from "@/components/Layout";
import { FC, ReactNode, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEntries } from "@/data/useStorage";

const MealStatsPage: FC = () => {
  const { entries } = useEntries();

  const mealStats = useMemo(() => {
    if (!entries?.length) return null;

    const totalMeals = entries.length;
    const tooMuch = entries.filter(
      (e) => e.data.portionSize === "large",
    ).length;
    const superHealthy = entries.filter(
      (e) => e.data.healthRating === "very-healthy",
    ).length;

    const mealTypes = {
      breakfast: entries.filter((e) => e.data.mealType === "breakfast").length,
      lunch: entries.filter((e) => e.data.mealType === "lunch").length,
      dinner: entries.filter((e) => e.data.mealType === "dinner").length,
      snack: entries.filter((e) => e.data.mealType === "snack").length,
    };

    const sortedDates = [
      ...new Set(
        entries.map((e) => new Date(e.date).toISOString().split("T")[0]),
      ),
    ].sort();

    let maxConsecutiveDays = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxConsecutiveDays = Math.max(maxConsecutiveDays, currentStreak);
        currentStreak = 1;
      }
    }
    maxConsecutiveDays = Math.max(maxConsecutiveDays, currentStreak);

    return {
      totalMeals,
      tooMuch,
      superHealthy,
      mealTypes,
      consecutiveDays: maxConsecutiveDays,
    };
  }, [entries]);

  const componentStats = useMemo(() => {
    const allComponents = entries
      ?.map((e) => e.data.components as string[])
      .flat(1);
    const componentCount = new Map<string, number>();

    allComponents?.forEach((component) => {
      componentCount.set(component, (componentCount.get(component) || 0) + 1);
    });

    // Convert to array for sorting
    const stats = Array.from(componentCount.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: allComponents.length
        ? Math.round((count / allComponents.length) * 100)
        : 0,
    }));

    return stats.sort((a, b) => b.count - a.count).slice(0, 10);
  }, [entries]);

  const combinationStats = useMemo(() => {
    const combinationCount = new Map<string, number>();

    entries?.forEach((entry) => {
      if (entry.data.components?.length > 1) {
        // Sort components to ensure consistent keys
        const combinationKey = [...entry.data.components].sort().join(", ");
        combinationCount.set(
          combinationKey,
          (combinationCount.get(combinationKey) || 0) + 1,
        );
      }
    });

    // Convert to array for sorting
    const stats = Array.from(combinationCount.entries()).map(
      ([combination, count]) => ({
        combination,
        components: combination.split(", "),
        count,
        percentage: entries.length
          ? Math.round((count / entries.length) * 100)
          : 0,
      }),
    );

    return stats.sort((a, b) => b.count - a.count).slice(0, 10);
  }, [entries]);

  const maxComponentCount =
    componentStats.length > 0 ? componentStats[0].count : 0;
  const maxCombinationCount =
    combinationStats.length > 0 ? combinationStats[0].count : 0;

  // Transform componentStats to match StatsItem interface
  const formattedComponentStats = componentStats.map((stat) => ({
    id: stat.name,
    name: stat.name,
    count: stat.count,
    percentage: stat.percentage,
    maxCount: maxComponentCount,
  }));

  // Transform combinationStats to match StatsItem interface
  const formattedCombinationStats = combinationStats.map((stat) => ({
    id: stat.combination,
    name: stat.components.join(", "),
    count: stat.count,
    percentage: stat.percentage,
    maxCount: maxCombinationCount,
  }));

  return (
    <Layout title="Statistics">
      <div className="container max-w-3xl mx-auto py-6 px-4 space-y-6">
        {/* Key Numbers Card */}
        <StatCard title="Summary">
          {mealStats ? (
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                label="Total Meals Logged"
                value={mealStats.totalMeals}
              />
              <StatItem
                label="Tracking Streak"
                value={mealStats.consecutiveDays}
                appendix="day(s)"
              />
              <StatItem
                label="Ate Too Much"
                value={mealStats.tooMuch}
                appendix="times"
              />
              <StatItem
                label="Healthy Meals"
                value={mealStats.superHealthy}
                appendix="times"
              />
            </div>
          ) : (
            <EmptyState message="No meal entries yet. Add some meals to see statistics." />
          )}
        </StatCard>

        <StatCard title="Top 10 Most Used Components">
          <StatsList
            items={formattedComponentStats}
            emptyMessage={
              entries?.length > 0
                ? "No matching components found"
                : "No meal entries yet. Add some meals to see statistics."
            }
          />
        </StatCard>

        {/* Top Combinations Card */}
        <StatCard title="Top 10 Most Used Component Combinations">
          <StatsList
            items={formattedCombinationStats}
            emptyMessage={
              entries?.length > 0
                ? "No component combinations found"
                : "No meal entries yet. Add some meals to see statistics."
            }
          />
        </StatCard>
      </div>
    </Layout>
  );
};

export default MealStatsPage;

interface StatCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const StatCard: FC<StatCardProps> = ({ title, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: ReactNode;
  appendix?: ReactNode;
}

const StatItem: FC<StatItemProps> = ({ label, value, appendix }) => {
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">
        {value}
        {appendix && (
          <span className="text-sm font-light ml-1">{appendix}</span>
        )}
      </div>
    </div>
  );
};
interface ProgressBarProps {
  percentage: number;
  className?: string;
}

const ProgressBar: FC<ProgressBarProps> = ({ percentage, className }) => {
  return (
    <div className="w-full bg-gray-100 rounded-md h-6 overflow-hidden">
      <div
        className={cn("h-full", "bg-green-600", className)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface StatsItem {
  id: string;
  name: string;
  count: number;
  percentage: number;
  maxCount: number;
}

interface StatsListProps {
  items: StatsItem[];
  emptyMessage: string;
}

const StatsList: FC<StatsListProps> = ({ items, emptyMessage }) => {
  return items.length > 0 ? (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">
              {item.count} {item.count === 1 ? "meal" : "meals"} (
              {item.percentage}%)
            </span>
          </div>
          <ProgressBar percentage={(item.count / item.maxCount) * 100} />
        </div>
      ))}
    </div>
  ) : (
    <EmptyState message={emptyMessage} />
  );
};

interface EmptyStateProps {
  message: string;
}

const EmptyState: FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">{message}</div>
  );
};
