"use client";

import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/shared/components/view-modes/types";

export function ViewModeToggle({
  value,
  onChange,
  labels,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  labels: Record<ViewMode, string>;
}) {
  const modes: ViewMode[] = ["list", "calendar", "kanban"];

  return (
    <div className="flex items-center gap-1">
      {modes.map((mode) => (
        <Button
          key={mode}
          type="button"
          size="sm"
          variant={mode === value ? "default" : "outline"}
          onClick={() => onChange(mode)}
        >
          {labels[mode]}
        </Button>
      ))}
    </div>
  );
}
