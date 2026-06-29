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

import { useEffect, useState } from "react";

import SortableSongCard from "./SortableSongCard";

import {
  updateSongOrder,
  type Song,
} from "../../services/songService";

type Props = {
  songs: Song[];
  loading: boolean;
  onRefresh: () => Promise<void>;
};

export default function SongList({
  songs,
  loading,
  onRefresh,
}: Props) {
  const [items, setItems] =
    useState<Song[]>(songs);

  useEffect(() => {
    setItems(songs);
  }, [songs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  if (loading) {
    return (
      <p className="text-zinc-500">
        Loading songs...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-24 text-center">
        <h2 className="text-2xl font-bold text-white">
          No Songs Yet
        </h2>

        <p className="mt-3 text-zinc-500">
          Tap the + button to upload your first
          demo.
        </p>
      </div>
    );
  }

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over || active.id === over.id)
      return;

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

    setItems(reordered);

    try {
      await updateSongOrder(reordered);

      await onRefresh();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to save song order."
      );

      setItems(songs);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        closestCenter
      }
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(
          (song) => song.id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <div className="space-y-3">
          {items.map(
            (song, index) => (
              <SortableSongCard
                key={song.id}
                song={song}
                songs={items}
                index={index}
                onDeleted={onRefresh}
              />
            )
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}