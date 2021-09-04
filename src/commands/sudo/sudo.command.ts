import { CommandInteraction } from "discord.js";
import { PingCommand, SayCommand } from "..";
import {
  CommandOption,
  CommandPermission,
  ICommand,
} from "../command.interface";

export class SudoCommand implements ICommand {
  name = "sudo";
  description = "Run admin commands.";
  default_permission = false;
  permissions: CommandPermission[] = [
    { id: "539910274698969088", type: "USER", permission: true },
  ];
  options: CommandOption[] = [
    {
      type: "SubcommandGroup",
      subCommandGroups: [
        {
          name: "meta",
          description: "Meta Commands",
          subCommands: [new PingCommand()],
        },
        {
          name: "course",
          description: "Course Commands",
          subCommands: [new SayCommand()],
        },
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const route = `${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`;

    if (route === "meta/ping") {
      await new PingCommand().execute(interaction);
    }

    if (route === "course/say") {
      await new SayCommand().execute(interaction);
    }
  }
}
