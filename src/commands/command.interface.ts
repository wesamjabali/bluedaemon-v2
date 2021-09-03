import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction } from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly options: CommandOptions[];
  readonly default_permission: boolean | undefined;

  execute(interaction: CommandInteraction): void;
}

export type CommandOptions = {
  type: ApplicationCommandOptionType;
  name?: string;
  description?: string;
  required?: boolean;
  choices?: [name: string, value: string | number][];
  subCommands?: ICommand[];
};
