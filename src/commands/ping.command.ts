import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import { CommandOptions, ICommand } from "./command.interface";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;
  options = [];

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const replyTime = new Date();
    await interaction.editReply(
      `${replyTime.getTime() - interaction.createdTimestamp}ms`
    );
  }
}
