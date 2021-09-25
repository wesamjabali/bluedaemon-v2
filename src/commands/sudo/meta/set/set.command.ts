import { CommandInteraction, Message } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { logger } from "@/main";

export class SetCommand implements ICommand {
  name = "set";
  description = "Set all parameters for this bot.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    { type: "Role", name: "moderator_role", required: false },
    { type: "Role", name: "course_manager_role", required: false },
    { type: "Channel", name: "course_requests_channel", required: false },
    { type: "Channel", name: "logging_channel", required: false },
    { type: "Channel", name: "counting_channel", required: false },
    { type: "Channel", name: "introductions_channel", required: false },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();
    if (!prisma.guild.findFirst({ where: { NOT: { currentQuarter: null } } })) {
      await i.followUp("You have to set up your server first.");
      return;
    }

    const countingChannel = i.options.getChannel("counting_channel", false);
    const courseRequestsChannel = i.options.getChannel(
      "course_requests_channel",
      false
    );
    const introductionsChannel = i.options.getChannel(
      "introductions_channel",
      false
    );
    const loggingChannel = i.options.getChannel("logging_channel", false);
    const modRole = i.options.getRole("moderator_role", false);
    const courseManagerRole = i.options.getRole("course_manager_role", false);
    if (!i.guildId || !i.guild || !i.guild?.ownerId) return;

    let errorResponse = "";
    if (loggingChannel && loggingChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nLogging channel must be text channel.`;
    }
    if (introductionsChannel && introductionsChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nIntroductions channel must be text channel.`;
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

    await prisma.guild.update({
      where: { guildId: i.guildId },
      data: {
        courseRequestsChannelId: courseRequestsChannel?.id ?? undefined,
        loggingChannelId: loggingChannel?.id ?? undefined,
        moderatorRoleId: modRole?.id ?? undefined,
        courseManagerRoleId: courseManagerRole?.id ?? undefined,
        countingChannelId: countingChannel?.id ?? undefined,
        countingChannelCurrentInt: countingChannel ? 0 : undefined,
        introductionsChannelId: introductionsChannel?.id ?? undefined,
      },
    });

    await resetCacheForGuild(i.guildId);

    const replyMessage = await i.followUp("Successfully updated settings.");

    logger.logToChannel(
      i.guild,
      `Bot settings updated. Context: ${(replyMessage as Message).url}`
    );
  }
}
