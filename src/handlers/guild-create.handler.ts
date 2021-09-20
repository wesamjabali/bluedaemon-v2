import { ClientEvents, Guild } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { updateCommandPermissions } from "@/helpers/add-command-permissions.helper";
import { logger } from "@/main";
import { SetupCommand } from "@/setup/setup.command";

export class GuildCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "guildCreate";
  public onEvent = async (guild: Guild) => {
    logger.info(guild, `Joined guild ${guild.name}`);
    /* Create Guildconfig Cache */
    await prisma.guild
      .create({
        data: { guildId: guild.id, guildOwnerId: guild.ownerId },
      })
      .catch(() => {});

    await resetCacheForGuild(guild.id);

    /* Give owner access to sudo commands */
    await updateCommandPermissions(
      "SET",
      "setup",
      new SetupCommand().permissions,
      guild,
      [{ roleType: "GuildOwner", id: guild.ownerId }]
    );
  };
}
