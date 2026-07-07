import StatCard from "@/components/dashboard/StatCard";

const dashboardStats = [
  {
    title: "Today's Opportunities",
    value: "14",
  },
  {
    title: "Cards Tracked",
    value: "312",
  },
  {
    title: "Active Alerts",
    value: "7",
  },
  {
    title: "Last Update",
    value: "Now",
  },
];

export default function DashboardGrid() {
  return (
    <section
      aria-label="Dashboard stats"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {dashboardStats.map((stat) => (
        <StatCard key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </section>
  );
}
