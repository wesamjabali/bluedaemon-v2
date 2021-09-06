import { ClientEvents, Guild } from "discord.js";
import { IEventHandler } from "./eventHandler";
import { prisma } from "../prisma/prisma.service";
import { resetCacheForGuild } from "../helpers/resetCacheForGuild.helper";

export class GuildCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "guildCreate";
  public onEvent = async (guild: Guild) => {
    /* Create Guildconfig Cache */
    await prisma.guild.create({ data: { guildId: guild.id, guildOwnerId: guild.ownerId } });
    await resetCacheForGuild(guild.id);
  };
}
