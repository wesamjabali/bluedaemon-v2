import { CommandInteraction } from "discord.js";
import { PingCommand, SayCommand } from "../index";
import {
  CommandOption,
  CommandPermission,
  ICommand,
} from "../command.interface";
import { SetupCommand } from "../setup/setup.command";

export class SudoCommand implements ICommand {
  name = "sudo";
  description = "Run admin commands.";
  default_permission = true;

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
    if (interaction.user.id !== interaction.guild?.ownerId) {
      interaction.reply({
        content: "Only the owner of the server can use sudo commands.",
        ephemeral: true,
      });
      return;
    }
    
    const route = `${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`;

    if (route === "meta/setup") {
      await new SetupCommand().execute(interaction);
    }
  }
}
