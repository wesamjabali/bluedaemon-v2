import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { SetupCommand } from "./meta/setup/setup.command";
import { UpdatePermissionCommand } from "./meta/update-permission/update-permission.command";
import { UpdateQuarterCommand } from "./course/update-quarter/update-quarter.command";
import { SetCommand } from "./meta/set/set.command";
import { SetWelcomeMessageCommand } from "./meta/set-welcome-message/set-welcome-message.command";

export class SudoCommand implements ICommand {
  name = "sudo";
  description = "Run admin commands.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "SubcommandGroup",
      subCommandGroups: [
        {
          name: "meta",
          description: "Meta Commands",
          subCommands: [
            new SetupCommand(),
            new UpdatePermissionCommand(),
            new SetCommand(),
            new SetWelcomeMessageCommand(),
          ],
        },
        {
          name: "course",
          description: "Course Commands",
          subCommands: [new UpdateQuarterCommand()],
        },
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const command = this.options[0].subCommandGroups
      ?.find((c) => c.name === interaction.options.getSubcommandGroup())
      ?.subCommands.find((c) => c.name === interaction.options.getSubcommand());

    command?.execute(interaction);
  }
}
