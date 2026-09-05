"use client";

import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { ScheduledItem } from "@/shared/components/view-modes/types";

// Hand-rolled with date-fns rather than react-day-picker: react-day-picker is a
// date-*selection* widget (one value in, one value out), not a content-per-day
// renderer — forcing an agenda view through it would fight its API.
export function CalendarMonthView({
  items,
  statusColor,
}: {
  items: ScheduledItem[];
  statusColor: (statusKey: string) => string;
}) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setMonth((m) => subMonths(m, 1))}>
          ‹
        </Button>
        <span className="text-sm font-medium">{format(month, "MMMM yyyy")}</span>
        <Button variant="outline" size="sm" onClick={() => setMonth((m) => addMonths(m, 1))}>
          ›
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {days.map((day) => {
          const dayItems = items.filter((item) => isSameDay(new Date(item.date), day));
          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 rounded-md border p-1 ${isSameMonth(day, month) ? "" : "opacity-40"}`}
            >
              <div className="text-muted-foreground">{format(day, "d")}</div>
              <div className="flex flex-col gap-1">
                {dayItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`truncate rounded px-1 py-0.5 text-white ${statusColor(item.statusKey)}`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
