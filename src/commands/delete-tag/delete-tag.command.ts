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
import { normalizeTagName } from "../tag-create/tag-create.service";

export class DeleteTagCommand implements ICommand {
  name = "tag-delete";
  description = "Delete a tag";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "tag_name",
      description: "Name of the tag to delete",
      required: true,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    let tagName = normalizeTagName(i.options.getString("tag_name", true));

    const tag = guildConfig?.tags.find((t) => t.name === tagName);
    if (!tag) {
      await i.reply(`${tagName} doesn't exist!`);
      return;
    }

    await prisma.tag.delete({
      where: { id: tag.id },
    });

    const replyMessage = (await i.reply({
      content: `Tag \`${tagName}\` deleted.`,
      fetchReply: true,
    })) as Message;

    await resetCacheForGuild(i.guildId as string, "tags");

    await logger.info(
      i.guild,
      `Tag deleted by ${i.user}.\n${tagName}\n\nContext: ${replyMessage.url}`
    );
  }
}
