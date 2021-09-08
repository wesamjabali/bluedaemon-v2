import { ClientEvents, Guild } from "discord.js";
import { IEventHandler } from "./eventHandler";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/resetCacheForGuild.helper";
import { addCommandPermissions } from "@/helpers/addCommandPermissions.helper";
import { rest } from "@/services/rest.service";
import { Routes } from "discord-api-types";
import { AllApplicationCommands } from "@/services/applicationCommands.service";
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
    const sudoCommand = (await new AllApplicationCommands().getAll())?.find(
      (c) => c.name === "sudo"
    );

    if (!sudoCommand) return;

    await addCommandPermissions(
      sudoCommand,
      new SudoCommand().permissions,
      [{ roleType: "GuildOwner", id: guild.ownerId }],
      guild
    );
  };
}
