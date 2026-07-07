import AppShell from "@/components/ui/AppShell";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function Home() {
  return (
    <AppShell>
      <div className="w-full space-y-6">
        <DashboardHeader />
        <DashboardGrid />
      </div>
    </AppShell>
  );
}
