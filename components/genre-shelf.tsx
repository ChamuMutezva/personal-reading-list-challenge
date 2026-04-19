"use client";

import { useState } from "react";
import Image from "next/image";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CuratedBook } from "@/data/curated-guest-library";

type ShelfBook = CuratedBook & { _id: string };

function SortableBook({ book }: Readonly<{ book: ShelfBook }>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: book._id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  };

  const progressColor = book.status === "finished" ? "bg-emerald-500" : book.status === "reading" ? "bg-amber-500" : "bg-blue-500";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="group relative w-32 sm:w-36 flex-shrink-0 snap-start">
      <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-md bg-stone-100 transition-transform group-hover:scale-105">
        <Image src={book.coverUrl} alt={book.title} fill className="object-cover" sizes="(max-width: 640px) 128px, 144px" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white">
          <p className="text-[10px] font-medium text-center line-clamp-3 mb-1">{book.title}</p>
          <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${progressColor} transition-all`} style={{ width: `${book.progressPercent}%` }} />
          </div>
          <p className="text-[9px] mt-0.5">{book.progressPercent}%</p>
        </div>
      </div>
      <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white ${
        book.status === "to-read" ? "bg-blue-500" : book.status === "reading" ? "bg-amber-500" : "bg-emerald-500"
      }`}>
        {book.status === "to-read" ? "T" : book.status === "reading" ? "R" : "F"}
      </span>
    </div>
  );
}

interface GenreShelfProps {
  genre: string;
  books: CuratedBook[];
  onStatusChange: (updated: CuratedBook[]) => void;
}

export function GenreShelf({ genre, books, onStatusChange }: Readonly<GenreShelfProps>) {
  const [shelfBooks, setShelfBooks] = useState<ShelfBook[]>(() =>
    books.map((b, i) => ({ ...b, _id: `${b.googleId}-${i}` }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = shelfBooks.findIndex((b) => b._id === active.id);
    const newIndex = shelfBooks.findIndex((b) => b._id === over.id);

    const reordered = arrayMove(shelfBooks, oldIndex, newIndex);

    // Update status/progress based on new position
    const updated = reordered.map((book, idx) => {
      const ratio = idx / reordered.length;
      let newStatus: CuratedBook["status"] = "to-read";
      let newPercent = Math.round(ratio * 100);

      if (ratio >= 0.66) { newStatus = "finished"; newPercent = 100; }
      else if (ratio >= 0.33) { newStatus = "reading"; }

      return { ...book, status: newStatus, progressPercent: newPercent };
    });

    setShelfBooks(updated);
    onStatusChange(updated.map(({ _id, ...rest }) => rest));
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-3 px-1">{genre}</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="relative -mx-4 px-4 overflow-x-auto pb-4 snap-x">
          <div className="flex gap-4 snap-mandatory">
            <SortableContext items={shelfBooks.map((b) => b._id)} strategy={horizontalListSortingStrategy}>
              {shelfBooks.map((book) => (
                <SortableBook key={book._id} book={book} />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}