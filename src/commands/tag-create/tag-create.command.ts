import { CommandInteraction, Message, Role } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { logger } from "@/main";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { getGuildConfig } from "@/config/guilds.config";
import { normalizeTagName } from "./tag-create.service";

export class CreateTagCommand implements ICommand {
  name = "tag-create";
  description = "Create a tag";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "tag_name",
      description: "Name of the tag to create",
      required: true,
    },
    {
      type: "String",
      name: "content",
      description: "Use \\n for newline.",
      required: true,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    let tagName = normalizeTagName(i.options.getString("tag_name", true));

    let content = i.options
      .getString("content", true)
      .replace(/\\n/g, "\n")
      .trim();
    if (content.length === 0) {
      i.reply("Content is required.");
      return;
    }

    if (guildConfig?.tags.find((t) => t.name === tagName)) {
      await i.reply(`${tagName} already exists!`);
      return;
    }

    await prisma.tag.create({
      data: { guildId: i.guildId as string, name: tagName, tagText: content },
    });

    const replyMessage = (await i.reply({
      content: `Tag \`${tagName}\` created.`,
      fetchReply: true,
    })) as Message;

    await resetCacheForGuild(i.guildId as string, "tags");

    await logger.logToChannel(
      i.guild,
      `Tag created by ${i.user}.\n\n${tagName}:\n${content}.\n\nContext: ${replyMessage.url}`
    );
  }
}
