import { Guild } from "@prisma/client";

export const guildConfigsCache: Guild[] = [];

export function getGuildConfig(
  guildIdToFind: string | null
): Guild | undefined {
  return guildConfigsCache.find((g) => g.guildId === guildIdToFind);
}
