import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import { CommandOptions, ICommand } from "./command.interface";
import { PingCommand } from ".";

export class SayCommand implements ICommand {
  name = "say";
  description = "Have me repear what you say";
  default_permission = true;
  options: CommandOptions[] = [
    {
      type: ApplicationCommandOptionType.Subcommand,
      subCommands: [new PingCommand()],
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    if (interaction.options.getSubcommand() === "ping") {
      await new PingCommand().execute(interaction);
    }
  }
}
