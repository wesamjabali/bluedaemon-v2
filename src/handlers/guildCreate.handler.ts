import { ClientEvents, Guild } from "discord.js";
import { IEventHandler } from "./eventHandler.interface";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/resetCacheForGuild.helper";
import { addCommandPermissions } from "@/helpers/addCommandPermissions.helper";
import { SudoCommand } from "@/commands";

export class GuildCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "guildCreate";
  public onEvent = async (guild: Guild) => {
    console.log(`Joined guild ${guild.name}`);
    /* Create Guildconfig Cache */
    await prisma.guild
      .create({
        data: { guildId: guild.id, guildOwnerId: guild.ownerId },
      })
      .catch(() => {});
    await resetCacheForGuild(guild.id);

    /* Give owner access to sudo commands */
    await addCommandPermissions(
      "sudo",
      new SudoCommand().permissions,
      [{ roleType: "GuildOwner", id: guild.ownerId }],
      guild
    );
  };
}
