import { CommandInteraction } from "discord.js";
import { CommandOption, ICommand } from "../command.interface";
import { prisma } from "../../prisma/prisma.service";

import { resetCacheForGuild } from "../../helpers/resetCacheForGuild.helper";

export class SetupCommand implements ICommand {
  name = "setup";
  description = "Set all parameters for this bot.";
  default_permission = true;

  options: CommandOption[] = [
    { type: "String", name: "current_quarter", required: true },
    { type: "Role", name: "moderator_role", required: true },
    { type: "Role", name: "course_manager_role", required: true },
    { type: "Channel", name: "course_requests_channel", required: true },
    { type: "Channel", name: "logging_channel", required: true },
    { type: "Channel", name: "counting_channel", required: false },
  ];

  async execute(i: CommandInteraction) {
    const currentQuarter = i.options.getString("current_quarter", true);
    const countingChannel = i.options.getChannel("counting_channel", false);
    const courseRequestsChannel = i.options.getChannel(
      "course_requests_channel",
      true
    );
    const loggingChannel = i.options.getChannel("logging_channel", true);
    const modRole = i.options.getRole("moderator_role", true);
    const courseManagerRole = i.options.getRole("course_manager_role", true);
    if (!i.guildId) return;

    let errorResponse = "";
    if (loggingChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nLogging channel must be text channel.`;
    }
    if (courseRequestsChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nCourse requests channel must be text channel.`;
    }
    if (countingChannel && countingChannel.type !== "GUILD_TEXT") {
      errorResponse = `${errorResponse}\nCounting channel must be text channel.`;
    }

    if (errorResponse.length > 0) {
      i.reply(`\`\`\`${errorResponse}\`\`\``);
      return;
    }

    await prisma.guild.update({
      where: { guildId: i.guildId },
      data: {
        currentQuarter: {
          connectOrCreate: {
            where: { name: currentQuarter },
            create: { name: currentQuarter, quarterCategoryChannelIds: [] },
          },
        },
        courseRequestsChannelId: courseRequestsChannel.id,
        loggingChannelId: loggingChannel.id,
        moderatorRoleId: modRole.id,
        courseManagerRoleId: courseManagerRole.id,
      },
    });

    if (countingChannel) {
      await prisma.guild.update({
        where: { guildId: i.guildId },
        data: { countingChannelId: countingChannel.id },
      });
    }

    await resetCacheForGuild(i.guildId).catch((e) => {
      i.reply(e);
      return;
    });

    await i.reply("Successfully set up server!");
  }
}
