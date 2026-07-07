import NavItem from "@/components/ui/NavItem";

const navigationItems = [
  "Dashboard",
  "Watchlists",
  "Cards",
  "Alerts",
  "Analytics",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[260px] flex-none flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-100">
      {/* App title area at the top of the sidebar. */}
      <div className="border-b border-zinc-800 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight">PriceTrackingLLC</h1>
      </div>

      {/* Main vertical navigation. */}
      <nav aria-label="Primary navigation" className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item}>
              <NavItem
                href="#"
                label={item}
                isSelected={item === "Dashboard"}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
