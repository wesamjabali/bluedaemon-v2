import { Guild, Course, Quarter, SelfRole, Tag } from "@prisma/client";

export const guildConfigsCache: GuildCache[] = [];

export function getGuildConfig(
  guildIdToFind: string | null | undefined
): GuildCache | undefined {
  return guildConfigsCache.find((g) => g.guildId === guildIdToFind);
}

export type GuildCache = Guild & {
  courses: Course[];
  currentQuarter: Quarter | null;
  quarters: Quarter[];
  selfRoles: SelfRole[];
  tags: Tag[];
};

export type GuildCacheItem = keyof GuildCache | keyof Guild | null;
