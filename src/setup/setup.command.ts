import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { commands } from "@/commands";
import { updateCommandPermissions } from "@/helpers/add-command-permissions.helper";

export class SetupCommand implements ICommand {
  name = "setup";
  description = "Prepare this bot for use and activate other commands.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    { type: "String", name: "current_quarter", required: true },
    { type: "Role", name: "moderator_role", required: true },
    { type: "Role", name: "course_manager_role", required: true },
    { type: "Channel", name: "course_requests_channel", required: true },
    { type: "Channel", name: "logging_channel", required: true },
    { type: "Channel", name: "counting_channel", required: false },
    { type: "Channel", name: "introductions_channel", required: false },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();

    const currentQuarter = i.options.getString("current_quarter", true);
    const countingChannel = i.options.getChannel("counting_channel", false);
    const introductionsChannel = i.options.getChannel(
      "introductions_channel",
      false
    );
    const courseRequestsChannel = i.options.getChannel(
      "course_requests_channel",
      true
    );
    const loggingChannel = i.options.getChannel("logging_channel", true);
    const modRole = i.options.getRole("moderator_role", true);
    const courseManagerRole = i.options.getRole("course_manager_role", true);
    if (!i.guildId || !i.guild || !i.guild?.ownerId) return;

    /* Create guild if it doesn't exist. */
    await prisma.guild
      .create({
        data: { guildId: i.guildId, guildOwnerId: i.guild.ownerId },
      })
      .catch(() => {});

    await resetCacheForGuild(i.guildId);

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
      i.followUp(`\`\`\`${errorResponse}\`\`\``);
      return;
    }

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
        courseRequestsChannelId: courseRequestsChannel.id,
        loggingChannelId: loggingChannel.id,
        moderatorRoleId: modRole.id,
        courseManagerRoleId: courseManagerRole.id,
        countingChannelId: countingChannel?.id ?? undefined,
        countingChannelCurrentInt: countingChannel ? 0 : undefined,
        introductionsChannelId: introductionsChannel?.id ?? undefined,
      },
    });

    /* Send commands and their permissions */
    for (const c of commands) {
      updateCommandPermissions("SET", c.name, c.permissions ?? [], i.guild, [
        { roleType: "CourseManager", id: courseManagerRole.id },
        { roleType: "Moderator", id: modRole.id },
        { roleType: "GuildOwner", id: i.guild.ownerId },
        { roleType: "Everyone", id: i.guild.roles.everyone.id },
      ]);
    }

    await resetCacheForGuild(i.guildId);

    updateCommandPermissions("REMOVE", "setup", [
      { id: i.user.id, permission: false, type: "USER" },
    ]);

    await i.followUp(
      "Successfully set up server! \n\n***IMPORTANT:***\nOne last step: Make the BlueDaemon role ordered above all other roles. It needs to be the first in the list.\nhttps://support.discord.com/hc/en-us/articles/214836687-Role-Management-101"
    );
  }
}
