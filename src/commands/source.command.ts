import { CommandInteraction } from "discord.js";
import { ICommand } from "./command.interface";

export class SourceCommand implements ICommand {
  name = "source";
  description = "Show my source code on GitHub!";
  default_permission = true;

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("https://github.com/wesamjabali/bluedaemon-v2");
  }
}
