import type { ReactNode } from "react";
import Sidebar, { type NavItemLabel } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";

type AppShellProps = {
  children: ReactNode;
  selectedNavItem?: NavItemLabel;
};

export default function AppShell({
  children,
  selectedNavItem = "Dashboard",
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar selectedItem={selectedNavItem} />

      {/* The right side contains the topbar and the current page content. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
