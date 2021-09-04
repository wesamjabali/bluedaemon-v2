import { ButtonAction } from "../buttons/ButtonAction.service";
import { SelectMenuAction } from "../selectMenus/SelectMenu.service";
import { ApplicationCommandOptionType } from "discord-api-types";
import {
  ApplicationCommandPermissionData,
  CommandInteraction,
} from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly options?: CommandOption[];
  readonly default_permission: boolean;
  readonly permissions?: ApplicationCommandPermissionData[];
  readonly buttonActions?: ButtonAction[];
  readonly selectMenuAction?: SelectMenuAction;

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
  choices?: [name: string, value: string | number][];
  subCommands?: ICommand[];
  subCommandGroups?: {
    name: string;
    description: string;
    subCommands: ICommand[];
  }[];
};

export type CommandOptionTypeString = keyof typeof ApplicationCommandOptionType;
