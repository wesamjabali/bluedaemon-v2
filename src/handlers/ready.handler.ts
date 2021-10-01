import { BuildCommands } from "@/helpers/build-commands.helper";
import { ClientEvents } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { config } from "@/services/config.service";
import { guildConfigsCache } from "@/config/guilds.config";
import { client, logger } from "@/main";
import { commands } from "@/commands";
import { updateCommandPermissions } from "@/helpers/add-command-permissions.helper";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { dispatchQotds } from "@/services/dispatchQotds.service";
import cron from "node-cron";
export class ReadyHandler implements IEventHandler {
  public once = true;
  public readonly EVENT_NAME: keyof ClientEvents = "ready";
  public onEvent = async () => {
    logger.info(null, "Starting bot...");

    while (
      config.envConfig.environment !== "prod" &&
      !client.guilds.cache.find((g) => g.id === config.envConfig.devGuildId)
    ) {
      await new Promise((r) => setTimeout(r, 5000));
      console.log("Waiting for bot to join dev guild...");
    }

    await new BuildCommands().execute();

    for (const guild of client.guilds.cache.values()) {
      const dbGuild = guildConfigsCache.find((gc) => gc.guildId === guild.id);
      /* Send commands and their permissions to keep perms up to date even if we add a new command. */
      // for (const c of commands) {
      //   updateCommandPermissions("ADD", c.name, c.permissions ?? [], guild, [
      //     {
      //       roleType: "CourseManager",
      //       id: dbGuild?.courseManagerRoleId ?? "",
      //     },
      //     { roleType: "Moderator", id: dbGuild?.moderatorRoleId ?? "" },
      //     { roleType: "GuildOwner", id: guild.ownerId },
      //   ]);
      // }

      await resetCacheForGuild(guild.id).catch(() =>
        logger.error(guild, "Ready handler cannot load cache")
      );
    }

    cron.schedule(
      "* 10 * * *",
      () => {
        dispatchQotds();
      },
      { scheduled: true, timezone: "America/Chicago" }
    );

    console.log(
      `Running in ${
        config.envConfig.environment === "prod" ? "Production" : "Developement"
      } mode as ${client.user?.username}`
    );
  };
}
