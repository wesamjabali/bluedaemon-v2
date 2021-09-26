import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { AddCourseAliasCommand } from "./add/add.command";
import { RemoveCourseAliasCommand } from "./remove/remove.command";

export class SudoCommand implements ICommand {
  name = "alias";
  description = "Alias commands";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "Subcommand",
      subCommands: [new AddCourseAliasCommand(), new RemoveCourseAliasCommand()],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const command = this.options[0]?.subCommands?.find((c) => c.name === interaction.options.getSubcommand());

    command?.execute(interaction);
  }
}
