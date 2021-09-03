import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import { CommandOptions, ICommand } from "./command.interface";
import { PingCommand } from ".";

export class TestCommand implements ICommand {
  name = "test";
  description = "A test command";
  default_permission = true;
  options: CommandOptions[] = [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      subCommandGroups: [
        { name: "p", description: "main", subCommands: [new PingCommand()] },
      ],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    if (interaction.options.getSubcommandGroup() !== "p") {
      new PingCommand().execute(interaction);
    }
  }
}
