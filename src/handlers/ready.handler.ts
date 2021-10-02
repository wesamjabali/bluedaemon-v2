import { BuildCommands } from "@/helpers/build-commands.helper";
import { ClientEvents } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { config } from "@/services/config.service";
import { client, logger } from "@/main";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { dispatchQotds } from "@/services/dispatchQotds.service";
import cron from "node-cron";
import { resetCacheForRealNames } from "@/config/real-names.config";
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
    await resetCacheForRealNames();

    for (const guild of client.guilds.cache.values()) {
      await resetCacheForGuild(guild.id).catch(() =>
        logger.error(guild, "Ready handler cannot load cache")
      );
    }

    cron.schedule(
      "0 10 * * *",
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
