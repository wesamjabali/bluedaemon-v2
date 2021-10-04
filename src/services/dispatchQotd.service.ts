import { Qotd } from ".prisma/client";
import { guildConfigsCache } from "@/config/guilds.config";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { client } from "@/main";
import { prisma } from "@/prisma/prisma.service";
import { Message, TextChannel } from "discord.js";

export async function dispatchQotd(
  guildId: string | null,
  qotdId?: number | null
) {
  const guild = guildConfigsCache.find((g) => g.guildId === guildId);
  if (!guild) return;

  if (guild.qotdChannelId) {
    const clientGuild = client.guilds.cache.find((g) => g.id === guild.guildId);
    clientGuild?.members.fetch();
    let nextQotd: Qotd | undefined;
    if (qotdId) {
      nextQotd = guild.qotds.find((q) => q.id === qotdId);
    } else {
      nextQotd = guild.qotds.find((q) => !q.used);
    }
    console.log(guild.qotds);
    const qotdChannel = clientGuild?.channels.cache.find(
      (c) => c.id === guild.qotdChannelId
    ) as TextChannel;

    if (nextQotd) {
      const qotdUser = clientGuild?.members.cache.find(
        (u) => u.id === nextQotd?.createdByUserId
      );
      let webhook = (await qotdChannel.fetchWebhooks()).first();
      if (!webhook) {
        webhook = await qotdChannel.createWebhook("QOTD Channel Webhook");
      }
      const qotdMessage = (await webhook.send({
        content: `Official Question of the Day #${
          guild.qotds.indexOf(nextQotd) + 1
        }:\n${nextQotd.question}`,
        avatarURL: qotdUser?.user.avatarURL() ?? undefined,
        username:
          qotdUser?.nickname ??
          qotdUser?.displayName ??
          qotdUser?.user.username ??
          "QOTD",
      })) as Message;

      qotdMessage.startThread({
        name: `QOTD ${guild.qotds.indexOf(nextQotd) + 1}`,
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
