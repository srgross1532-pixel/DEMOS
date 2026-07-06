import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { Song } from "../services/songService";
import { getSongUrl } from "../services/songService";

type AudioContextType = {
  audio: HTMLAudioElement;

  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;

  playing: boolean;

  currentTime: number;
  duration: number;

  expanded: boolean;

  playQueue: (
    songs: Song[],
    startIndex: number
  ) => Promise<void>;

  playPause: () => Promise<void>;

  next: () => Promise<void>;

  previous: () => Promise<void>;

  pause: () => void;

  seek: (time: number) => void;

  openPlayer: () => void;

  closePlayer: () => void;
};

const AudioContext =
  createContext<AudioContextType | null>(null);

export function AudioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audio = useMemo(() => new Audio(), []);

  const [queue, setQueue] = useState<Song[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const currentSong = useMemo(() => {
    if (
      currentIndex < 0 ||
      currentIndex >= queue.length
    )
      return null;

    return queue[currentIndex];
  }, [queue, currentIndex]);

  const [playing, setPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [expanded, setExpanded] =
    useState(false);

  useEffect(() => {
    const updateTime = () =>
      setCurrentTime(audio.currentTime);

    const updateDuration = () =>
      setDuration(audio.duration || 0);

    audio.addEventListener(
      "timeupdate",
      updateTime
    );

    audio.addEventListener(
      "loadedmetadata",
      updateDuration
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime
      );

      audio.removeEventListener(
        "loadedmetadata",
        updateDuration
      );
    };
  }, [audio]);
useEffect(() => {
  async function handleEnded() {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);

      const nextSong = queue[nextIndex];

      if (!nextSong?.audio_path) {
        setPlaying(false);
        return;
      }

      const url = await getSongUrl(nextSong.audio_path);

      audio.src = url;
      await audio.play();

      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }

  audio.addEventListener("ended", handleEnded);

  return () => {
    audio.removeEventListener("ended", handleEnded);
  };
}, [audio, currentIndex, queue]);

  async function playSong(song: Song) {
    if (!song.audio_path) return;

    const url = await getSongUrl(song.audio_path);

    audio.pause();

    // eslint-disable-next-line react-hooks/immutability
    audio.src = url;

    await audio.play();

    setPlaying(true);

  
  }

  async function playQueue(
    songs: Song[],
    startIndex: number
  ) {
    setQueue(songs);

    setCurrentIndex(startIndex);

    await playSong(songs[startIndex]);
  }

  async function playPause() {
    if (!currentSong) return;

    if (playing) {
      audio.pause();

      setPlaying(false);
    } else {
      await audio.play();

      setPlaying(true);
    }
  }

  async function next() {
    if (
      currentIndex >=
      queue.length - 1
    )
      return;

    const index = currentIndex + 1;

    setCurrentIndex(index);

    await playSong(queue[index]);
  }

  async function previous() {
    if (currentIndex <= 0) return;

    const index = currentIndex - 1;

    setCurrentIndex(index);

    await playSong(queue[index]);
  }

  function pause() {
    audio.pause();

    setPlaying(false);
  }

  function seek(time: number) {
    // eslint-disable-next-line react-hooks/immutability
    audio.currentTime = time;

    setCurrentTime(time);
  }

  function openPlayer() {
    setExpanded(true);
  }

  function closePlayer() {
    setExpanded(false);
  }

  return (
    <AudioContext.Provider
      value={{
        audio,

        queue,
        currentIndex,
        currentSong,

        playing,

        currentTime,
        duration,

        expanded,

        playQueue,
        playPause,
        next,
        previous,
        pause,
        seek,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() {
  const context =
    useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio must be used inside AudioProvider"
    );
  }

  return context;
}
