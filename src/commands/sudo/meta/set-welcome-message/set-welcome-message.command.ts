import { CommandInteraction, Role, User } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class SetWelcomeMessageCommand implements ICommand {
  name = "set-welcome-message";
  description = "Set this server's welcome message to send to all new members.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "message",
      required: false,
      description:
        "Welcome message to send to all new members. Leave blank to disable this feature.",
    },
  ];

  async execute(i: CommandInteraction) {
    await prisma.guild.update({
      where: { guildId: i.guildId as string },
      data: {
        welcomeMessage:
          i.options.getString("message")?.replace(/\\n/g, "\n") ?? null,
      },
    });
    await resetCacheForGuild(i.guildId as string, "welcomeMessage");
    await i.reply(`Member welcome message set!`);
  }
}
