import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class SetCommand implements ICommand {
  name = "set";
  description = "Set all parameters for this bot.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    { type: "String", name: "current_quarter", required: false },
    { type: "Role", name: "moderator_role", required: false },
    { type: "Role", name: "course_manager_role", required: false },
    { type: "Channel", name: "course_requests_channel", required: false },
    { type: "Channel", name: "logging_channel", required: false },
    { type: "Channel", name: "counting_channel", required: false },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();
    if (!prisma.guild.findFirst({ where: { NOT: { currentQuarter: null } } })) {
      await i.followUp("You have to set up your server first.");
      return;
    }

    const currentQuarter = i.options.getString("current_quarter", false);
    const countingChannel = i.options.getChannel("counting_channel", false);
    const courseRequestsChannel = i.options.getChannel(
      "course_requests_channel",
      false
    );
    const loggingChannel = i.options.getChannel("logging_channel", false);
    const modRole = i.options.getRole("moderator_role", false);
    const courseManagerRole = i.options.getRole("course_manager_role", false);
    if (!i.guildId || !i.guild || !i.guild?.ownerId) return;

    await resetCacheForGuild(i.guildId);

    let errorResponse = "";
    if (loggingChannel && loggingChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nLogging channel must be text channel.`;
    }
    if (courseRequestsChannel && courseRequestsChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nCourse requests channel must be text channel.`;
    }
    if (countingChannel && countingChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nCounting channel must be text channel.`;
    }

    if (errorResponse.length > 0) {
      i.followUp(`\`\`\`${errorResponse}\`\`\``);
      return;
    }

    let existingDbQuarter;
    if (currentQuarter) {
      existingDbQuarter = await prisma.quarter.findFirst({
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
    }

    await prisma.guild.update({
      where: { guildId: i.guildId },
      data: {
        currentQuarter: {
          connect: { id: existingDbQuarter?.id ?? undefined },
        },
        courseRequestsChannelId: courseRequestsChannel?.id ?? undefined,
        loggingChannelId: loggingChannel?.id ?? undefined,
        moderatorRoleId: modRole?.id ?? undefined,
        courseManagerRoleId: courseManagerRole?.id ?? undefined,
        countingChannelId: countingChannel?.id ?? undefined,
      },
    });

    await resetCacheForGuild(i.guildId);

    await i.followUp("Successfully updated settings.");
  }
}
