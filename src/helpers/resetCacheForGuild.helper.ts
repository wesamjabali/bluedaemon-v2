import { prisma } from "@/prisma/prisma.service";
import { guildConfigsCache } from "@/config/guilds.config";

export async function resetCacheForGuild(guildId: string) {
  guildConfigsCache.splice(
    guildConfigsCache.findIndex((gc) => gc.guildId === guildId),
    1
  );

  const newCache = await prisma.guild.findFirst({
    where: { guildId: guildId },
  });

  if (!newCache) {
    return Promise.reject("Cache could not reset for guild " + guildId);
  }

  guildConfigsCache.push(newCache);
}
