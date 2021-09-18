export function normalizeTagName(tagName: string): string {
  return tagName.toLowerCase().trim().replace(/ */g, "");
}