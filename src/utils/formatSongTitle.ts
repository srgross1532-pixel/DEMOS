export function formatSongTitle(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")          // remove extension
    .replace(/[_-]+/g, " ")            // underscores -> spaces
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}