import { guildConfigsCache } from "@/config/guilds.config";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { client } from "@/main";
import { prisma } from "@/prisma/prisma.service";
import { TextChannel } from "discord.js";

export async function dispatchQotds() {
  for (const guild of guildConfigsCache)
    if (guild.qotdChannelId) {
      const clientGuild = client.guilds.cache.find(
        (g) => g.id === guild.guildId
      );
      const nextQotd = guild.qotds.find((q) => !q.used);
      const qotdChannel = clientGuild?.channels.cache.find(
        (c) => c.id === guild.qotdChannelId
      ) as TextChannel;

      if (nextQotd) {
        const qotdMessage = await qotdChannel.send(
          `QOTD #${guild.qotds.length} from <@${nextQotd.createdByUserId}>:\n${nextQotd.question}`
        );
        qotdMessage.startThread({
          name: `QOTD #${guild.qotds.length}`,
          autoArchiveDuration: "MAX",
        });
        await prisma.qotd.update({
          where: { id: nextQotd.id },
          data: { used: true },
        });
        resetCacheForGuild(guild.guildId, "qotds");
      }
      
    }
}
