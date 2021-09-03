import { CommandInteraction } from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly options: CommandOptions;
  readonly default_permission: boolean | undefined;

  execute(interaction: CommandInteraction): void;
}

export type CommandOptions = {
  stringOptions: StringOption[];
  integerOptions: IntegerOption[];
};

export type StringOption = {
  name: string;
  description: string;
  required: boolean;
  choices: [name: string, value: string][];
};

export type IntegerOption = {
  name: string;
  description: string;
  required: boolean;
  choices: [name: string, value: number][];
};
