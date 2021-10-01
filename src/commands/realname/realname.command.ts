import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { RealNameGetCommand } from "./get/get.command";
import { RealNameSetCommand } from "./set/set.command";


export class RealNameCommand implements ICommand {
  name = "realname";
  description = "Realname commands";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "Subcommand",
      subCommands: [new RealNameGetCommand(), new RealNameSetCommand()],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const command = this.options[0]?.subCommands?.find((c) => c.name === interaction.options.getSubcommand());

    command?.execute(interaction);
  }
}
