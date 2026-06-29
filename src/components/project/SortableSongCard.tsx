import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import SongCard from "./SongCard";
import type { Song } from "../../services/songService";

type Props = {
  song: Song;
  songs: Song[];
  index: number;
  onDeleted: () => Promise<void>;
};

export default function SortableSongCard({
  song,
  songs,
  index,
  onDeleted,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: song.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <SongCard
        song={song}
        songs={songs}
        index={index}
        onDeleted={onDeleted}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
}