"use client";

import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { Link } from "@/i18n/navigation";
import type { ScheduledItem } from "@/shared/components/view-modes/types";

export type KanbanColumn = { key: string; label: string };

function KanbanCard({ item, readOnly }: { item: ScheduledItem; readOnly: boolean }) {
  // Always called (rules of hooks) even when readOnly — its listeners/attributes
  // are simply not spread onto the element in that case, so the card renders as
  // plain, non-draggable content.
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  return (
    <div
      ref={readOnly ? undefined : setNodeRef}
      {...(readOnly ? {} : listeners)}
      {...(readOnly ? {} : attributes)}
      style={
        !readOnly && transform
          ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 }
          : undefined
      }
      className={`rounded-md border bg-card p-2 text-sm shadow-sm ${readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
    >
      <Link
        href={item.href}
        className="hover:underline"
        onClick={(e) => !readOnly && isDragging && e.preventDefault()}
      >
        {item.title}
      </Link>
    </div>
  );
}

function KanbanColumnDropZone({
  column,
  items,
  readOnly,
}: {
  column: KanbanColumn;
  items: ScheduledItem[];
  readOnly: boolean;
}) {
  // Same always-call-the-hook, ignore-the-output-when-readOnly shape as KanbanCard.
  const { setNodeRef, isOver } = useDroppable({ id: column.key });
  return (
    <div
      ref={readOnly ? undefined : setNodeRef}
      className={`flex min-h-48 flex-col gap-2 rounded-md border p-2 ${!readOnly && isOver ? "bg-accent" : ""}`}
    >
      <h3 className="text-sm font-medium">{column.label}</h3>
      {items.map((item) => (
        <KanbanCard key={item.id} item={item} readOnly={readOnly} />
      ))}
    </div>
  );
}

// No local drag state: columns are derived from `items` (server data) on every
// render. onDrop decides whether a transition is valid and fires a mutation if so;
// an invalid/rejected drop needs no manual revert, since nothing about the
// underlying data changed.
export function KanbanBoard({
  columns,
  items,
  onDrop,
  readOnly = false,
}: {
  columns: KanbanColumn[];
  items: ScheduledItem[];
  onDrop?: (itemId: number, fromStatus: string, toStatus: string) => void;
  readOnly?: boolean;
}) {
  function handleDragEnd(event: DragEndEvent) {
    if (readOnly || !onDrop) return;
    const { active, over } = event;
    if (!over) return;
    const item = items.find((i) => i.id === active.id);
    if (!item) return;
    const toStatus = String(over.id);
    if (toStatus === item.statusKey) return;
    onDrop(Number(active.id), item.statusKey, toStatus);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((column) => (
          <KanbanColumnDropZone
            key={column.key}
            column={column}
            items={items.filter((item) => item.statusKey === column.key)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </DndContext>
  );
}
