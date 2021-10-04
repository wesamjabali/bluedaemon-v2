import { CommandInteraction, Guild } from "discord.js";
import { ICommand } from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const guildConfig = getGuildConfig(interaction.guildId);
    console.log(guildConfig?.qotds);
    await resetCacheForGuild(interaction.guildId as string, "qotds")
    const replyTime = new Date();

    await interaction.editReply({
      content: `Pong! Message -> Bot Server in ${
        replyTime.getTime() - interaction.createdTimestamp
      }ms`,
    });
  }
}
