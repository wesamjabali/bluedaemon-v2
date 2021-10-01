import { CommandInteraction, Message, Role } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { logger } from "@/main";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class CreateQotdCommand implements ICommand {
  name = "create-qotd";
  description = "Create a QOTD";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "question",
      description: "Use \\n for newline.",
      required: true,
    },
  ];

  async execute(i: CommandInteraction) {
    let qotd = i.options
      .getString("question", true)
      .replace(/\\n/g, "\n")
      .trim();

    if (qotd.length === 0) {
      i.reply("Content is required.");
      return;
    }

    const dbQotd = await prisma.qotd.create({
      data: {
        createdByUserId: i.user.id,
        guildId: i.guildId as string,
        used: false,
        question: qotd,
      },
    });

    await resetCacheForGuild(i.guildId as string, "qotds");

    const replyMessage = (await i.reply({
      content: `QOTD created. ID is ${dbQotd.id}`,
      fetchReply: true,
    })) as Message;

    await logger.logToChannel(
      i.guild,
      `QOTD created by ${i.user}.\n\n\`${qotd}\`\n\nContext: ${replyMessage.url}`
    );
  }
}
