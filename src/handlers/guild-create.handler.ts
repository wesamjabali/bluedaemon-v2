import { ClientEvents, Guild } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { updateCommandPermissions } from "@/helpers/add-command-permissions.helper";
import { logger } from "@/main";
import { config } from "@/services/config.service";
import { BuildCommands } from "@/helpers/build-commands.helper";

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

    if (
      config.envConfig.environment !== "prod" &&
      guild.id === config.envConfig.devGuildId
    ) {
      await new BuildCommands().execute();
    }

    /* Give owner access to setup commands */
    await updateCommandPermissions(
      "SET",
      "setup",
      [{ type: "USER", permission: true, id: guild.ownerId }],
      guild
    );
  };
}
