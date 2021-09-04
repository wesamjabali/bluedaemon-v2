import { ButtonAction } from "../buttons/buttonAction.service";
import { SelectMenuAction } from "../selectMenus/selectMenuAction.service";
import { ApplicationCommandOptionType } from "discord-api-types";
import {
  ApplicationCommandPermissionData,
  CommandInteraction,
} from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly default_permission: boolean;
  mainInteraction?: CommandInteraction;

  readonly options?: CommandOption[];
  readonly permissions?: ApplicationCommandPermissionData[];

  readonly buttonActions?: ButtonAction[];
  readonly selectMenuActions?: SelectMenuAction[];

  execute(interaction: CommandInteraction): void;
}

export type CommandPermission = {
  id: string;
  type: "USER" | "ROLE";
  permission: boolean;
};

export type CommandOption = {
  type: CommandOptionTypeString;
  name?: string;
  description?: string;
  required?: boolean;
  choices?: CommandOptionChoice[];
  subCommands?: ICommand[];
  subCommandGroups?: SubCommandGroup[];
};

export type CommandOptionTypeString = keyof typeof ApplicationCommandOptionType;
export type CommandOptionChoice = [name: string, value: string | number];
export type SubCommandGroup = {
  name: string;
  description: string;
  subCommands: ICommand[];
};
