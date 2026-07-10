"use client";

import { useEffect, useState } from "react";
import CommandPalette from "@/components/search/CommandPalette";
import type { CommandPaletteContext } from "@/components/search/CommandPaletteRouter";

export default function Topbar({ context }: { context: CommandPaletteContext }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <button className="flex w-full max-w-md items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-left text-sm text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30" onClick={() => setOpen(true)} type="button"><span>Search anything…</span><kbd className="rounded border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-400">⌘K / Ctrl+K</kbd></button>

      {/* Simple avatar placeholder until user accounts are added. */}
      <button
        type="button"
        aria-label="User menu"
        className="ml-4 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        PT
      </button>
    </header>
    <CommandPalette context={context} onClose={() => setOpen(false)} open={open} />
    </>
  );
}
