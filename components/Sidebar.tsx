type NavigationItem = "Dashboard" | "Watchlists" | "Cards" | "Alerts" | "Settings";

type SidebarProps = {
  selectedItem?: NavigationItem;
};

const navigationItems: NavigationItem[] = [
  "Dashboard",
  "Watchlists",
  "Cards",
  "Alerts",
  "Settings",
];

export default function Sidebar({ selectedItem = "Dashboard" }: SidebarProps) {
  return (
    <aside className="flex min-h-screen w-[260px] flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-100">
      {/* App title stays fixed at the top of the navigation rail. */}
      <div className="border-b border-zinc-800 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight">PriceTrackingLLC</h1>
      </div>

      {/* Primary app navigation. */}
      <nav aria-label="Primary navigation" className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isSelected = item === selectedItem;

            return (
              <li key={item}>
                <a
                  href="#"
                  aria-current={isSelected ? "page" : undefined}
                  className={`block rounded-md px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                    isSelected
                      ? "bg-cyan-400 text-zinc-950"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
