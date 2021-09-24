import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { UpdatePermissionCommand } from "./meta/update-permission/update-permission.command";
import { UpdateQuarterCommand } from "./course/update-quarter/update-quarter.command";
import { SetCommand } from "./meta/set/set.command";
import { SetWelcomeMessageCommand } from "./meta/set-welcome-message/set-welcome-message.command";
import { SetWelcomeRoleCommand } from "./meta/set-welcome-role/set-welcome-role.command";
import { SetupCommand } from "../../setup/setup.command";
import { MigrateCommand } from "./course/migrate/migrate.command";

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
            new UpdatePermissionCommand(),
            new SetCommand(),
            new SetWelcomeMessageCommand(),
            new SetWelcomeRoleCommand(),
          ],
        },
        {
          name: "course",
          description: "Course Commands",
          subCommands: [new UpdateQuarterCommand(), new MigrateCommand()],
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
