import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { CreateQotdCommand } from "@/commands";
import { DeleteQotdCommand } from "./delete/delete-qotd.command";
import { DispatchQotdCommand } from "./dispatch/dispatch-qotd.command";


export class AliasCommand implements ICommand {
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
        new DispatchQotdCommand()
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
