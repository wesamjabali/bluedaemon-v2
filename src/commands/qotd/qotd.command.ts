import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import {
  CreateQotdCommand,
  DeleteQotdCommand,
  DispatchQotdCommand,
  ListQotdCommand,
} from "@/commands";

export class QotdCommand implements ICommand {
  name = "qotd";
  description = "QOTD commands";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "Subcommand",
      subCommands: [
        new CreateQotdCommand(),
        new DeleteQotdCommand(),
        new DispatchQotdCommand(),
        new ListQotdCommand(),
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const command = this.options[0]?.subCommands?.find(
      (c) => c.name === interaction.options.getSubcommand()
    );

    command?.execute(interaction);
  }
}
