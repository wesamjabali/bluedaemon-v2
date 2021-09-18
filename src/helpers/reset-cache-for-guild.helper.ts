import { prisma } from "@/prisma/prisma.service";
import {
  GuildCache,
  GuildCacheItem,
  guildConfigsCache,
} from "@/config/guilds.config";
export async function resetCacheForGuild(
  guildId: string,
  propertyToReset?: keyof GuildCache | null
) {
  // Get old cache
  let oldCache = guildConfigsCache.find((gc) => gc.guildId === guildId);

  // delete old cache if it exists.
  const oldCacheIndex = guildConfigsCache.findIndex(
    (gcc) => gcc.guildId === guildId
  );
  if (oldCacheIndex > -1) {
    guildConfigsCache.splice(oldCacheIndex, 1);
  }

  // If it doesn't exist, start from scratch.
  if (!oldCache) {
    propertyToReset = null;
  }

  let newCache: GuildCache | null;
  if (!propertyToReset) {
    newCache = await prisma.guild.findFirst({
      where: { guildId: guildId },
      include: {
        courses: true,
        currentQuarter: true,
        quarters: true,
        selfRoles: true,
        tags: true,
      },
    });
    if (!newCache) {
      return Promise.reject("Cache could not reset for guild " + guildId);
    }
  } else {
    const updates = (await prisma.guild.findFirst({
      where: { guildId: guildId },
      select: {
        [propertyToReset as string]: true,
      },
    })) as Partial<GuildCache>;

    newCache = oldCache as GuildCache;
    (newCache[propertyToReset] as GuildCacheItem) = updates[
      propertyToReset
    ] as GuildCacheItem;
  }

  guildConfigsCache.push(newCache);
}
