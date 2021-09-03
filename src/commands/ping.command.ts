import { CommandInteraction } from "discord.js";
import { ICommand } from "./command.interface";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const replyTime = new Date();
    await interaction.editReply(
      `Pong! Message -> Bot Server in ${
        replyTime.getTime() - interaction.createdTimestamp
      }ms`
    );
  }
}
