import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class UpdateQuarterCommand implements ICommand {
  name = "update-quarter";
  description =
    "Set current quarter. Will create the quarter if it doesn't exist.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    { type: "String", name: "current_quarter", required: true },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();

    const currentQuarter = i.options.getString("current_quarter", true);

    if (!i.guildId || !i.guild || !i.guild?.ownerId) return;

    let existingDbQuarter = await prisma.quarter.findFirst({
      where: { AND: { name: currentQuarter, guild: { guildId: i.guildId } } },
    });

    if (!existingDbQuarter) {
      existingDbQuarter = await prisma.quarter.create({
        data: {
          name: currentQuarter,
          guild: { connect: { guildId: i.guildId } },
        },
      });
    }

    await prisma.guild.update({
      where: { guildId: i.guildId },
      data: {
        currentQuarter: {
          connect: { id: existingDbQuarter.id },
        },
      },
    });

    await resetCacheForGuild(i.guildId, "currentQuarter");
    await resetCacheForGuild(i.guildId, "currentQuarterId");
    await resetCacheForGuild(i.guildId, "quarters");

    await i.followUp(`Quarter updated to ${currentQuarter}`);
  }
}
