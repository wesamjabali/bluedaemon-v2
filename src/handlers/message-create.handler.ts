import { ClientEvents, Message } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { prisma } from "@/prisma/prisma.service";
import { client } from "@/main";

export class MessageCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "messageCreate";
  public async onEvent(msg: Message) {
    if (msg.member?.user.id === client.user?.id) return;
    const guildConfig = getGuildConfig(msg.guildId);
    console.log(guildConfig);
    if (msg.channelId === guildConfig?.countingChannelId) {
      const msgArray = msg.content.split(/\s+/g);
      const msgNumber = parseInt(msgArray[0]);

      if (parseInt(msgArray[1]) === msgNumber + 1) {
        const response = await msg.reply(
          `One number per message, ${msg.member}!`
        );
        msg.delete();
        return await new Promise(() =>
          setTimeout(() => response.delete(), 4000)
        );
      }

      if (msgNumber === (guildConfig?.countingChannelCurrentInt ?? 0) + 1) {
        guildConfig.countingChannelCurrentInt = msgNumber;

        await prisma.guild.update({
          where: { guildId: msg.guildId as string },
          data: {
            countingChannelCurrentInt: msgNumber,
          },
        });
      } else {
        const lastMessage = (
          await msg.channel.messages.fetch({ limit: 2 })
        ).last()?.content;

        const previousNumber = parseInt(lastMessage?.split(" ").shift() || "0");

        if (msgNumber === previousNumber + 1) {
          guildConfig.countingChannelCurrentInt = msgNumber;

          await prisma.guild.update({
            where: { guildId: msg.guildId as string },
            data: {
              countingChannelCurrentInt: msgNumber,
            },
          });
        } else {
          msg.delete();
        }
      }
    }
  }
}
