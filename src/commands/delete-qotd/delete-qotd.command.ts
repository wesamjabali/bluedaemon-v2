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

export class DeleteQotdCommand implements ICommand {
  name = "delete-qotd";
  description = "Delete a QOTD";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "Integer",
      name: "qotd_td",
      description: "ID of the QOTD to delete.",
      required: true,
    },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();
    let qotdId = i.options.getInteger("qotd_id", true);
    const guildConfig = getGuildConfig(i.guildId);
    const qotd = guildConfig?.qotds.find((q) => q.id === qotdId);

    if (!qotd) {
      return i.followUp(
        "That's not a valid QOTD ID. Check the ID from when it was created."
      );
    }

    await prisma.qotd.delete({ where: { id: qotdId } });
    resetCacheForGuild(i.guildId as string, "qotds");

    const replyMessage = (await i.followUp({
      content: `QOTD deleted. ID was ${qotdId}. Question was: \n\`${qotd.question}\`\n`,
      fetchReply: true,
    })) as Message;

    await logger.logToChannel(
      i.guild,
      `QOTD created by ${i.user}.\n\n\`${qotd}\`\n\nContext: ${replyMessage.url}`
    );
  }
}
