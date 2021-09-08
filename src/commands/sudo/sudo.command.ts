import { CommandInteraction } from "discord.js";

import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { SetupCommand } from "@/commands/setup/setup.command";

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
          subCommands: [new SetupCommand()],
        },
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const route = `${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`;

    if (route === "meta/setup") {
      await new SetupCommand().execute(interaction);
    }
  }
}
