import { CommandInteraction } from "discord.js";
import { ICommand } from "./command.interface";

export class PingCommand implements ICommand {
  public readonly name = "ping";
  readonly description = "Pong!";

  public async execute(interaction: CommandInteraction): Promise<void> {
    const replyTime = new Date();
    await interaction.reply("Pong!");
    await interaction.editReply(
      `Pong! ${replyTime.getTime() - interaction.createdTimestamp}ms`
    );
  }
}
