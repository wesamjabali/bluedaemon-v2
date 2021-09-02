import { Interaction } from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  execute(interaction: Interaction): void;
}
