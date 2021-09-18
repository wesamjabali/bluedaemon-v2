import { BuildCommands } from "@/helpers/build-commands.helper";
import { ClientEvents, TextChannel } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { config } from "@/services/config.service";
import { prisma } from "@/prisma/prisma.service";
import { getGuildConfig, guildConfigsCache } from "@/config/guilds.config";
import { client, logger } from "@/main";
import { commands } from "@/commands";
import { updateCommandPermissions } from "@/helpers/add-command-permissions.helper";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class ReadyHandler implements IEventHandler {
  public once = true;
  public readonly EVENT_NAME: keyof ClientEvents = "ready";
  public onEvent = async () => {
    logger.info(null, "Bot started.");

    while (
      !client.guilds.cache.find((g) => g.id === config.envConfig.devGuildId)
    ) {
      await new Promise((r) => setTimeout(r, 5000));
      console.log("Waiting for bot to join dev guild...");
    }
    /* Create Guildconfig Cache */
    for (const g of client.guilds.cache.values()) {
      await resetCacheForGuild(g.id).catch((e) => console.error(e));
    }

    await new BuildCommands().execute();

    for (const guild of client.guilds.cache.values()) {
      const dbGuild = guildConfigsCache.find((gc) => gc.guildId === guild.id);
      /* Send commands and their permissions to keep perms up to date even if we add a new command. */
      for (const c of commands) {
        await updateCommandPermissions(
          "ADD",
          c.name,
          c.permissions ?? [],
          guild,
          [
            {
              roleType: "CourseManager",
              id: dbGuild?.courseManagerRoleId ?? "",
            },
            { roleType: "Moderator", id: dbGuild?.moderatorRoleId ?? "" },
            { roleType: "GuildOwner", id: guild.ownerId },
          ]
        );
      }
    }

    console.log(`Running in ${config.envConfig.environment} mode.`);
  };
}
