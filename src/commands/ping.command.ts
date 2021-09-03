import { CommandInteraction } from "discord.js";
import { CommandOptions, ICommand } from "./command.interface";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;
  options: CommandOptions = {
    stringOptions: [
      {
        name: "name",
        description: "Enter your name.",
        required: true,
        choices: [["Pong", "ping"]],
      },
      { name: "boop", description: "beep", required: false, choices: [] },
    ],
    integerOptions: [
      {
        name: "numping",
        description: "Cheat your ping!",
        required: false,
        choices: [],
      },
    ],
  };

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const replyTime = new Date();
    await interaction.editReply(
      `${interaction.options.getString("name")} ${
        interaction.options.getInteger("numping") ||
        replyTime.getTime() - interaction.createdTimestamp
      }ms`
    );
  }
}
