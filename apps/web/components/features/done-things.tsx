"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ResponseType } from "@doing-the-thing/shared";

interface DoneEntry {
  id: string;
  thingLabel: string;
  type: string;
  respondedAt: string;
}

interface DoneThingsProps {
  entries: DoneEntry[];
}

function EntryList({ entries }: { entries: DoneEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-center py-2" style={{ color: "var(--text-muted)" }}>
        Nothing here yet.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between py-2 px-3 rounded-btn"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              ✓
            </span>
            <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
              {entry.thingLabel}
            </span>
          </div>
          <span className="text-xs whitespace-nowrap ml-3" style={{ color: "var(--text-muted)" }}>
            {new Date(entry.respondedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DoneThings({ entries }: DoneThingsProps) {
  const [showMobile, setShowMobile] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("show-done-things");
    setShowMobile(stored !== "false");
    setLoaded(true);
  }, []);

  function toggleMobile() {
    const next = !showMobile;
    setShowMobile(next);
    localStorage.setItem("show-done-things", String(next));
  }

  if (!loaded) return null;

  return (
    <>
      {/* Mobile: collapsible toggle */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobile}
          className="flex items-center gap-2 text-sm mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          <span
            className="transition-transform duration-150 inline-block"
            style={{ transform: showMobile ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▸
          </span>
          {showMobile ? "Hide done things" : "Done things"}
          {!showMobile && entries.length > 0 && (
            <span className="text-xs opacity-60">({entries.length})</span>
          )}
        </button>
        {showMobile && (
          <div className="mt-3">
            <EntryList entries={entries} />
          </div>
        )}
      </div>

      {/* Desktop: toggleable sidebar card */}
      <div className="hidden lg:block sticky top-8">
        <button
          onClick={toggleMobile}
          className="flex items-center gap-2 text-sm mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          <span
            className="transition-transform duration-150 inline-block"
            style={{ transform: showMobile ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▸
          </span>
          {showMobile ? "Hide done things" : "Done things"}
          {!showMobile && entries.length > 0 && (
            <span className="text-xs opacity-60">({entries.length})</span>
          )}
        </button>
        {showMobile && (
          <Card>
            <EntryList entries={entries} />
          </Card>
        )}
      </div>
    </>
  );
}
