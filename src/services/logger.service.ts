import { BotLogLevel } from ".prisma/client";
import { getGuildConfig } from "@/config/guilds.config";
import { prisma } from "@/prisma/prisma.service";
import { Guild, TextChannel } from "discord.js";

export class LoggerService {
  log = async (level: BotLogLevel, guild: Guild | null, ...text: string[]) => {
    let loggerChannel;
    if (guild) {
      loggerChannel = guild?.channels.cache.find(
        (c) => c.id === getGuildConfig(guild?.id)?.loggingChannelId
      ) as TextChannel;
    }
    console.log(guild?.id, text);

    for (let t of text) {
      if (guild && loggerChannel) {
        loggerChannel.send(t);
      }
      await prisma.log.create({
        data: { guildId: guild?.id, level: level, message: t },
      });
    }
  };

  info = async (guild: Guild | null, ...text: string[]) => {
    let loggerChannel;
    if (guild) {
      loggerChannel = guild?.channels.cache.find(
        (c) => c.id === getGuildConfig(guild?.id)?.loggingChannelId
      ) as TextChannel;
    }
    console.info(guild?.id, text);

    for (let t of text) {
      if (guild && loggerChannel) {
        loggerChannel.send(t);
      }
      await prisma.log.create({
        data: { guildId: guild?.id, level: "INFO", message: t },
      });
    }
  };

  debug = async (guild: Guild | null, ...text: string[]) => {
    let loggerChannel;
    if (guild) {
      loggerChannel = guild?.channels.cache.find(
        (c) => c.id === getGuildConfig(guild?.id)?.loggingChannelId
      ) as TextChannel;
    }
    console.debug(guild?.id, text);

    for (let t of text) {
      if (guild && loggerChannel) {
        loggerChannel.send(t);
      }
      await prisma.log.create({
        data: { guildId: guild?.id, level: "DEBUG", message: t },
      });
    }
  };

  warn = async (guild: Guild | null, ...text: string[]) => {
    let loggerChannel;
    if (guild) {
      loggerChannel = guild?.channels.cache.find(
        (c) => c.id === getGuildConfig(guild?.id)?.loggingChannelId
      ) as TextChannel;
    }
    console.warn(guild?.id, text);

    for (let t of text) {
      if (guild && loggerChannel) {
        loggerChannel.send(t);
      }
      await prisma.log.create({
        data: { guildId: guild?.id, level: "WARN", message: t },
      });
    }
  };

  error = async (guild: Guild | null, ...text: string[]) => {
    let loggerChannel;
    if (guild) {
      loggerChannel = guild?.channels.cache.find(
        (c) => c.id === getGuildConfig(guild?.id)?.loggingChannelId
      ) as TextChannel;
    }
    console.error(guild?.id, text);

    for (let t of text) {
      if (guild && loggerChannel) {
        loggerChannel.send(t);
      }
      await prisma.log.create({
        data: { guildId: guild?.id, level: "ERROR", message: t },
      });
    }
  };

  fatal = async (guild: Guild | null, ...text: string[]) => {
    let loggerChannel;
    if (guild) {
      loggerChannel = guild?.channels.cache.find(
        (c) => c.id === getGuildConfig(guild?.id)?.loggingChannelId
      ) as TextChannel;
    }
    console.error(guild?.id, text);

    for (let t of text) {
      if (guild && loggerChannel) {
        loggerChannel.send(t);
      }
      await prisma.log.create({
        data: { guildId: guild?.id, level: "FATAL", message: t },
      });
    }
  };
}
