import { client } from "@/main";
import { rest } from "@/services/rest.service";
import { config } from "@/services/config.service";
import { CommandOption, ICommand } from "@/commands/command.interface";
import { commands } from "@/commands";
import { ApplicationCommand } from "discord.js";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { registerButtons } from "@/buttons";
import { registerSelectMenus } from "@/selectMenus";
import { updateCommandPermissions } from "./addCommandPermissions.helper";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";

export class BuildCommands {
  public async execute(): Promise<void> {
    const JSONCommands: ICommandData[] = [];

    // Build the command
    commands.forEach((command) => {
      JSONCommands.push(
        (getCommandBuilder(command, false) as SlashCommandBuilder).toJSON()
      );

      registerButtons(command.buttonActions ?? []);
      registerSelectMenus(command.selectMenuActions ?? []);
    });

    // Attach to application or guild
    if (config.envConfig.environment === "production") {
      await rest.put(Routes.applicationCommands(config.envConfig.clientId), {
        body: JSONCommands,
      });
    } else {
      await rest.put(
        Routes.applicationGuildCommands(
          config.envConfig.clientId,
          config.envConfig.devGuildId
        ),
        {
          body: JSONCommands,
        }
      );
    }

    // Add permission overrides
    commands.forEach(async (c) => {
      await updateCommandPermissions("ADD", c.name, c.permissions ?? []);
    });

    console.log(
      `Built commands: [${Array.from(JSONCommands, (command) => command.name)}]`
    );
  }
}

function getCommandBuilder(
  command: ICommand,
  isSubCommand: boolean // True if the command being passed in is a subcommand, and can therefore not accept subcommands or subcommandgroups.
): SlashCommandSubcommandBuilder | SlashCommandBuilder {
  let newCommand: SlashCommandBuilder | SlashCommandSubcommandBuilder;

  if (isSubCommand) {
    newCommand = new SlashCommandSubcommandBuilder();
    registerButtons(command.buttonActions ?? []);
    registerSelectMenus(command.selectMenuActions ?? []);
  } else {
    newCommand = new SlashCommandBuilder();
    newCommand.setDefaultPermission(command.default_permission ?? true);
  }

  newCommand.setName(command.name);
  newCommand.setDescription(command.description);

  for (const currentOption of command.options ?? []) {
    // Add generic options
    addGenericCommandOption(newCommand, currentOption, isSubCommand);
  }

  return newCommand;
}

export interface ICommandData {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
  default_permission: boolean | undefined;
}

function getGenericCommandOption(
  option: any,
  currentOption: CommandOption
): any {
  option
    .setName(currentOption.name ?? "Missing Name")
    .setDescription(currentOption.description ?? "Missing Description")
    .setRequired(currentOption.required ?? false);

  if (currentOption.choices) {
    option.addChoices(currentOption.choices || []);
  }

  return option;
}

function addGenericCommandOption(
  newCommand: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  currentOption: CommandOption,
  isSubCommand: boolean
) {
  // Add subcommand, but not to other subcommands.
  if (!isSubCommand) {
    if (currentOption.type === "Subcommand") {
      for (const currentSubCommand of currentOption.subCommands || []) {
        newCommand = newCommand as SlashCommandBuilder;
        newCommand.addSubcommand(
          <SlashCommandSubcommandBuilder>(
            getCommandBuilder(currentSubCommand, true)
          )
        );
      }
    }
  }
  // Add subcommand groups
  if (currentOption.type === "SubcommandGroup") {
    for (const currentSubCommandGroup of currentOption.subCommandGroups ?? []) {
      const newCommandGroup: SlashCommandSubcommandGroupBuilder =
        new SlashCommandSubcommandGroupBuilder();

      newCommandGroup
        .setName(currentSubCommandGroup.name)
        .setDescription(currentSubCommandGroup.description);

      for (const currentSubCommand of currentSubCommandGroup.subCommands) {
        newCommandGroup.addSubcommand(
          getCommandBuilder(
            currentSubCommand,
            true
          ) as SlashCommandSubcommandBuilder
        );
      }

      (newCommand as SlashCommandBuilder).addSubcommandGroup(newCommandGroup);
    }
  }

  if (currentOption.type === "String") {
    newCommand.addStringOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "Integer") {
    newCommand.addIntegerOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "Number") {
    newCommand.addNumberOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "Boolean") {
    newCommand.addBooleanOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "User") {
    newCommand.addUserOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "Channel") {
    newCommand.addChannelOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "Mentionable") {
    newCommand.addMentionableOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }

  if (currentOption.type === "Role") {
    newCommand.addRoleOption((option) =>
      getGenericCommandOption(option, currentOption)
    );
  }
}
