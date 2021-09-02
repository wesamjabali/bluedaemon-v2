import { Interaction } from "discord.js";
import { ICommand } from "./command.interface";

export class PingCommand implements ICommand {
  public readonly name = "ping";
  readonly description = "Returns ping time";

  public execute(interaction: Interaction): void {
    interaction.channel?.send("Hello!");
  }
}
