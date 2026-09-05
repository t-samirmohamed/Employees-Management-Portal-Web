"use client";

import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { Link } from "@/i18n/navigation";
import type { ScheduledItem } from "@/shared/components/view-modes/types";

export type KanbanColumn = { key: string; label: string };

function KanbanCard({ item }: { item: ScheduledItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={
        transform
          ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 }
          : undefined
      }
      className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm active:cursor-grabbing"
    >
      <Link
        href={item.href}
        className="hover:underline"
        onClick={(e) => isDragging && e.preventDefault()}
      >
        {item.title}
      </Link>
    </div>
  );
}

function KanbanColumnDropZone({ column, items }: { column: KanbanColumn; items: ScheduledItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-48 flex-col gap-2 rounded-md border p-2 ${isOver ? "bg-accent" : ""}`}
    >
      <h3 className="text-sm font-medium">{column.label}</h3>
      {items.map((item) => (
        <KanbanCard key={item.id} item={item} />
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
}: {
  columns: KanbanColumn[];
  items: ScheduledItem[];
  onDrop: (itemId: number, fromStatus: string, toStatus: string) => void;
}) {
  function handleDragEnd(event: DragEndEvent) {
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
          />
        ))}
      </div>
    </DndContext>
  );
}
