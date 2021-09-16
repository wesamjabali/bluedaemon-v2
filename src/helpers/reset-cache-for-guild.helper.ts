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
  let oldCache: GuildCache | undefined = guildConfigsCache
    .splice(
      guildConfigsCache.findIndex((gc) => gc.guildId === guildId),
      1
    )
    .shift();

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

  if (!newCache) {
    return Promise.reject("Cache could not reset for guild " + guildId);
  }

  guildConfigsCache.push(newCache as GuildCache);
}
