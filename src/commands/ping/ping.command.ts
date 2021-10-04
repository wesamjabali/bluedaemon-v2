import { CommandInteraction } from "discord.js";
import { ICommand } from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const guildConfig = getGuildConfig(interaction.guildId);
    console.log(guildConfig?.qotds);

    const replyTime = new Date();

    await interaction.editReply({
      content: `Pong! Message -> Bot Server in ${
        replyTime.getTime() - interaction.createdTimestamp
      }ms`,
    });
  }
}
