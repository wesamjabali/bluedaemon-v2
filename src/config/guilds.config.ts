import { Guild, Course, Quarter } from "@prisma/client";

export const guildConfigsCache: GuildCache[] = [];

export function getGuildConfig(
  guildIdToFind: string | null
): GuildCache | undefined {
  return guildConfigsCache.find((g) => g.guildId === guildIdToFind);
}

export type GuildCache = Guild & {
  courses: Course[];
  currentQuarter: Quarter | null;
  quarters: Quarter[];
};

export type GuildCacheItem = keyof GuildCache | keyof Guild | null;
