import { BuildCommands } from "../helpers/buildCommands.helper";
import { ClientEvents } from "discord.js";
import { IEventHandler } from "./eventHandler";
import { config } from "../services/config.service";
import { prisma } from "../prisma/prisma.service";
import { guildConfigsCache } from "../config/guilds.config";

export class ReadyHandler implements IEventHandler {
  public once = true;
  public readonly EVENT_NAME: keyof ClientEvents = "ready";
  public onEvent = async () => {
    try {
      await prisma.quarter.create({
        data: { name: "autumn21", quarterCategoryChannelIds: [] },
      });
    } catch {}
    try {
      await prisma.guild.create({
        data: { guildId: "875779544521523250", currentQuarterName: "autumn21" },
      });
    } catch {}

    /* Create Guildconfig Cache */
    guildConfigsCache.push(...(await prisma.guild.findMany()));

    await new BuildCommands().execute();

    console.log(`Running in ${config.envConfig.environment} mode.`);
  };
}
