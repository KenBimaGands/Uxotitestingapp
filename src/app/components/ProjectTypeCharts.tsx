import { useProjectStore } from "../store/useProjectStore";
import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";

export function ProjectTypeCharts() {
  const projects = useProjectStore((state) => state.projects);

  const methodData = useMemo(() => [
    {
      id: "method-heuristic",
      name: "Heuristic",
      count: projects.filter((p) => p.method === "Heuristic").length,
    },
    {
      id: "method-7dimensions",
      name: "7 Dimensions",
      count: projects.filter((p) => p.method === "7 Dimensions").length,
    },
  ], [projects]);

  const platformData = useMemo(() => [
    {
      id: "platform-mobile",
      name: "Mobile",
      count: projects.filter((p) => p.platform === "Mobile").length,
      color: "var(--chart-1)",
    },
    {
      id: "platform-web",
      name: "Web",
      count: projects.filter((p) => p.platform === "Web").length,
      color: "var(--chart-2)",
    },
    {
      id: "platform-desktop",
      name: "Desktop",
      count: projects.filter((p) => p.platform === "Desktop").length,
      color: "var(--chart-3)",
    },
    {
      id: "platform-crossplatform",
      name: "Cross-platform",
      count: projects.filter((p) => p.platform === "Cross-platform").length,
      color: "var(--chart-4)",
    },
  ], [projects]);

  const filteredPlatformData = useMemo(
    () => platformData.filter((item) => item.count > 0),
    [platformData]
  );

  return (
    <>
      <Card className="p-6 bg-card border-border">
        <h3 className="mb-4">Projects by Evaluation Method</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={methodData} key="method-chart">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'var(--text-label-family)' }}
            />
            <YAxis 
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'var(--text-label-family)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "var(--text-p-size)",
                fontFamily: "var(--text-p-family)",
              }}
            />
            <Bar 
              dataKey="count" 
              fill="var(--chart-2)" 
              fillOpacity={0.6}
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="mb-4">Projects by Platform</h3>
        {filteredPlatformData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart key="platform-chart">
              <Pie
                data={filteredPlatformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="count"
                nameKey="name"
                isAnimationActive={false}
                style={{ fontSize: '11px', fontFamily: 'var(--text-caption-family)' }}
              >
                {filteredPlatformData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "var(--text-p-size)",
                  fontFamily: "var(--text-p-family)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            <p className="caption">No platform data available</p>
          </div>
        )}
      </Card>
    </>
  );
}