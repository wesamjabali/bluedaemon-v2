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
          subCommands: [new SetupCommand(), new UpdatePermissionCommand(), new SetCommand()],
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
    const route = `${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`;

    if (route === "meta/setup") {
      await new SetupCommand().execute(interaction);
    }

    if (route === "meta/set") {
      await new SetCommand().execute(interaction);
    }

    if (route === "meta/update-permission") {
      await new UpdatePermissionCommand().execute(interaction);
    }

    if (route === "course/update-quarter") {
      await new UpdateQuarterCommand().execute(interaction);
    }
  }
}
