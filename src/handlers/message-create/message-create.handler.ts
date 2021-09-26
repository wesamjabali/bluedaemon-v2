import { ClientEvents, Message } from "discord.js";
import { IEventHandler } from "../event-handler.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { prisma } from "@/prisma/prisma.service";

const welcomeMessages = [
  "A huge welcome to you,",
  "Everyone please welcome",
  "Welcome,",
  "We're so happy to have you,",
  "Thanks for joining,",
  "You're gonna love it here,",
  "Glad you made it,",
  "Welcome aboard,",
];

export class MessageCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "messageCreate";
  public async onEvent(msg: Message) {
    const guildConfig = getGuildConfig(msg.guildId);
    if (msg.channelId === guildConfig?.introductionsChannelId) {
      const newThread = await msg.startThread({
        name: msg.author.username,
        autoArchiveDuration: "MAX",
        reason: "Intro thread by BlueDaemon",
      });

      newThread.send(
        `${
          welcomeMessages[
            Math.floor(Math.random() * welcomeMessages.length - 1)
          ]
        } ${msg.author}!`
      );
    }

    if (msg.channelId === guildConfig?.countingChannelId) {
      const msgNumber = parseInt(msg.content.split(" ")[0]);
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
