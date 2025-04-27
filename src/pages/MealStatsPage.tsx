import { FC, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { useMeals } from "../data/useStorage";
import { useToken } from "@/components/AuthenticationContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "@/lib/utils";

const MealStatsPage: FC = () => {
  const token = useToken();
  const { entries } = useMeals(token);

  const componentStats = useMemo(() => {
    const allComponents = entries?.flatMap((e) => e.components);
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

    return stats.sort((a, b) => b.count - a.count);
  }, [entries]);

  const maxCount = componentStats.length > 0 ? componentStats[0].count : 0;

  return (
    <Layout title="Statistics">
      <div className="container max-w-3xl mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Most Used Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {componentStats.length > 0 ? (
              componentStats.map((stat) => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{stat.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.count} {stat.count === 1 ? "meal" : "meals"} (
                      {stat.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={(stat.count / maxCount) * 100}
                    className={cn(
                      "h-2",
                      stat.percentage > 75
                        ? "bg-green-100"
                        : stat.percentage > 50
                          ? "bg-blue-100"
                          : stat.percentage > 25
                            ? "bg-yellow-100"
                            : "bg-gray-100",
                    )}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {entries.length > 0
                  ? "No matching components found"
                  : "No meal entries yet. Add some meals to see statistics."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MealStatsPage;
