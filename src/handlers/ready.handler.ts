import { BuildCommands } from "@/helpers/buildCommands.helper";
import { ClientEvents } from "discord.js";
import { IEventHandler } from "./eventHandler.interface";
import { config } from "@/services/config.service";
import { prisma } from "@/prisma/prisma.service";
import { guildConfigsCache } from "@/config/guilds.config";
import { client } from "@/main";
import { commands } from "@/commands";
import { updateCommandPermissions } from "@/helpers/addCommandPermissions.helper";

export class ReadyHandler implements IEventHandler {
  public once = true;
  public readonly EVENT_NAME: keyof ClientEvents = "ready";
  public onEvent = async () => {
    /* Create Guildconfig Cache */
    guildConfigsCache.push(...(await prisma.guild.findMany()));

    await new BuildCommands().execute();

    for (const g of client.guilds.cache.values()) {
      const dbGuild = await prisma.guild.findFirst({
        where: { guildId: g.id },
      });

      /* Send commands and their permissions to keep perms up to date even if we add a new command. */
      for (const c of commands) {
        await updateCommandPermissions(
          "ADD",
          c.name,
          c.permissions ?? [],
          [
            {
              roleType: "CourseManager",
              id: dbGuild?.courseManagerRoleId ?? "",
            },
            { roleType: "Moderator", id: dbGuild?.moderatorRoleId ?? "" },
            { roleType: "GuildOwner", id: g.ownerId },
            { roleType: "Everyone", id: g.roles.everyone.id },
          ],
          g
        );
      }
    }

    console.log(`Running in ${config.envConfig.environment} mode.`);
  };
}
