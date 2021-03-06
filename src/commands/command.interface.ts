import { ButtonAction } from "@/buttons/button-action";
import { SelectMenuAction } from "@/select-menus/select-menu-action";
import { ApplicationCommandOptionType, Snowflake } from "discord-api-types";
import {
  ApplicationCommandPermissionData,
  CommandInteraction,
} from "discord.js";

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly default_permission: boolean;

  readonly options?: CommandOption[];
  readonly permissions?: CommandOptionPermission[];

  readonly buttonActions?: ButtonAction[];
  readonly selectMenuActions?: SelectMenuAction[];

  execute(interaction: CommandInteraction): void;
}

export enum dynamicPermissionUserOrRole {
  USER = "USER",
  ROLE = "ROLE",
  Everyone = "ROLE",
  CourseManager = "ROLE",
  Moderator = "ROLE",
  GuildOwner = "USER",
}

export type CommandPermission = {
  id: string;
  type: UserOrRole;
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
export type CommandOptionPermission = {
  type: PermissionTypes;
  id?: Snowflake;
  permission: boolean;
};
export type SubCommandGroup = {
  name: string;
  description: string;
  subCommands: ICommand[];
};
export type UserOrRole = "USER" | "ROLE";

export type DynamicPermissionTypes = keyof typeof dynamicPermissionUserOrRole;
export type PermissionTypes = UserOrRole | DynamicPermissionTypes;

export type PermissionRoles = {
  roleType: DynamicPermissionTypes;
  id: string;
};
