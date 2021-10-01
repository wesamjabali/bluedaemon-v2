import { prisma } from "@/prisma/prisma.service";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { logger } from "@/main";
import { CommandInteraction } from "discord.js";
import { resetCacheForRealNames } from "@/config/real-names.config";

export class RealNameSetCommand implements ICommand {
  name = "set-realname";
  description = "Set your real name";
  default_permission = true;

  options: CommandOption[] = [
    {
      type: "String",
      name: "real_name",
      description: "Your real name. Leave blank to reset.",
      required: false,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const realName = i.options.getString("real_name", false);

    if (realName) {
      await prisma.realName.upsert({
        where: { userId: i.user.id },
        update: { realName: realName },
        create: { realName: realName, userId: i.user.id },
      });

      logger.logToChannel(
        i.guild,
        `${i.user} set their real name to real name to "${realName}""`
      );
    } else {
      await prisma.realName.delete({ where: { userId: i.user.id } }).catch();

      logger.logToChannel(i.guild, `${i.user} reset their real name.`);
    }

    resetCacheForRealNames();

    await i.reply({
      content: realName
        ? `Successfully set your real name to ${realName}`
        : `Successfully removed your real name`,
      ephemeral: true,
    });
  }
}
