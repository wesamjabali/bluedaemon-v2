import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { logger } from "@/main";

export class LogCommand implements ICommand {
  name = "log";
  description = "Add something to the logs.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];
  options: CommandOption[] = [
    {
      type: "String",
      name: "text",
      description: "Text to log.",
      required: true,
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    logger.info(
      interaction.guild,
      `**USER LOG**\n\n${interaction.user} says:\n` +
        interaction.options.getString("text", true)
    );
    interaction.reply({ content: "Data logged.", ephemeral: true });
  }
}
