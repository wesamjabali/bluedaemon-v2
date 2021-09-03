import { CommandInteraction } from "discord.js";
import { PingCommand, SayCommand } from ".";
import { CommandOption, CommandPermission, ICommand } from "./command.interface";

export class TestCommand implements ICommand {
  name = "test";
  description = "A test command";
  default_permission = true;
  permissions: CommandPermission[] = [{id: "539910274698969088", type: "USER", permission: false}];
  options: CommandOption[] = [
    {
      type: "SubcommandGroup",
      subCommandGroups: [
        { name: "main", description: "main", subCommands: [new PingCommand()] },
        { name: "second", description: "secondary group", subCommands: [new SayCommand()] },
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    const route = `${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`;

    if (route === "main/ping") {
      await new PingCommand().execute(interaction);
    }

    if (route === "second/say") {
      await new SayCommand().execute(interaction);
    }
  }
}
