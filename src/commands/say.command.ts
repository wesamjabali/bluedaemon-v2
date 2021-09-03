import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import { CommandOptions, ICommand } from "./command.interface";
import { PingCommand } from ".";

export class SayCommand implements ICommand {
  name = "say";
  description = "Have me repeat what you say";
  default_permission = true;
  options: CommandOptions[] = [
    {
      type: ApplicationCommandOptionType.String,
      name: "repeat",
      description: "The message you'd like me to repeat",
      required: true,
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(interaction.options.getString("repeat", true));
  }
}
