import { CommandInteraction } from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  execute(interaction: CommandInteraction): void;
}
