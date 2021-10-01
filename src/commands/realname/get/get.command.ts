import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getRealName } from "@/config/real-names.config";
import { logger } from "@/main";
import { CommandInteraction } from "discord.js";

export class RealNameGetCommand implements ICommand {
  name = "get";
  description = "Get a member's real name";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
    { type: "Moderator", permission: true },
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "User",
      name: "user",
      description: "User to get the real name of",
      required: true,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const user = i.options.getUser("user", true);
    const realName = getRealName(user.id);

    if (realName) {
      logger.logToChannel(i.guild, `${i.user} got real name of ${user}`);
    }
    
    await i.reply({
      content: realName
        ? `${user}'s real name is ${realName}`
        : `No real name defined for ${user}`,
      ephemeral: true,
    });
  }
}
