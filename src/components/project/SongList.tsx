import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useState } from "react";

import SortableSongCard from "./SortableSongCard";

import {
  updateSongOrder,
  type Song,
} from "../../services/songService";

type Props = {
  songs: Song[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onOpenOptions: (song: Song) => void;
};

export default function SongList({
  songs,
  loading,
  onRefresh,
  onOpenOptions,
}: Props) {
  const [pendingItems, setPendingItems] =
    useState<Song[] | null>(null);

  const items = pendingItems ?? songs;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(
      (song) => song.id === active.id
    );

    const newIndex = items.findIndex(
      (song) => song.id === over.id
    );

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    setPendingItems(reordered);

    try {
      await updateSongOrder(reordered);
      await onRefresh();
      setPendingItems(null);
    } catch (err) {
      console.error(err);

      alert("Failed to save song order.");

      setPendingItems(null);
    }
  }

  if (loading) {
    return (
      <p className="text-zinc-500">
        Loading songs...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-20 rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-white">
          No demos yet
        </h2>

        <p className="mt-3 text-zinc-500">
          Upload a rough mix, rehearsal take, or voice memo to start the conversation.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((song) => song.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((song, index) => (
            <SortableSongCard
              key={song.id}
              song={song}
              songs={items}
              index={index}
              onOpenOptions={onOpenOptions}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
