import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import { CommandOptions, ICommand } from "./command.interface";
import { PingCommand, SayCommand } from ".";

export class TestCommand implements ICommand {
  name = "test";
  description = "A test command";
  default_permission = true;
  options: CommandOptions[] = [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      subCommandGroups: [
        { name: "main", description: "main", subCommands: [new PingCommand()] },
        {
          name: "second",
          description: "secondary group",
          subCommands: [new SayCommand()],
        },
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    /* Main subgroup */
    if (interaction.options.getSubcommandGroup() === "main") {
      await interaction.channel?.send(
        "You ran a command under the main subgroup!"
      );
      if (interaction.options.getSubcommand() === "ping") {
        await new PingCommand().execute(interaction);
      }
    }

    /* Second subgroup */
    if (interaction.options.getSubcommandGroup() === "second") {
      await interaction.channel?.send(
        "You ran a command under the second subgroup!"
      );
      if (interaction.options.getSubcommand() === "say") {
        await new SayCommand().execute(interaction);
      }
    }
  }
}
