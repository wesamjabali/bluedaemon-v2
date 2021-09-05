import { client } from "../main";
import { REST } from "@discordjs/rest";
import { config } from "../services/config.service";
import { CommandOption, ICommand } from "../commands/command.interface";
import { commands } from "../commands";
import { ApplicationCommand } from "discord.js";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import { registerButtons } from "../buttons";
import { registerSelectMenus } from "../selectMenus";

export class BuildCommands {
  public async execute(): Promise<void> {
    const rest = new REST({ version: "9" }).setToken(config.envConfig.token);

    const JSONCommands: ICommandData[] = [];

    // Build the command
    commands.forEach((command) => {
      JSONCommands.push(
        (getCommandBuilder(command, false) as SlashCommandBuilder).toJSON()
      );

      registerButtons(command.buttonActions ?? []);
      registerSelectMenus(command.selectMenuActions ?? []);
    });

    let allSentApplicationCommands: ApplicationCommand[] = [];

    // Attach to application or guild
    if (config.envConfig.environment === "production") {
      allSentApplicationCommands = (await rest.put(
        Routes.applicationCommands(config.envConfig.clientId),
        {
          body: JSONCommands,
        }
      )) as ApplicationCommand[];
    } else {
      allSentApplicationCommands = (await rest.put(
        Routes.applicationGuildCommands(
          config.envConfig.clientId,
          config.envConfig.devGuildId
        ),
        {
          body: JSONCommands,
        }
      )) as ApplicationCommand[];
    }

    // Add permission overrides
    allSentApplicationCommands.forEach(async (command) => {
      const permissions = commands.find(
        (c) => c.name === command.name
      )?.permissions;

      if (permissions) {
        /* Attach globally if in prod */
        if (config.envConfig.environment === "production") {
          const fetchedCommand = await client.application?.commands.fetch(
            command.id
          );

          fetchedCommand?.permissions.add({
            guild: fetchedCommand.guild ?? config.envConfig.devGuildId,
            permissions,
          });
        } else {
          /* Attach to dev server otherwise */
          const fetchedCommand = await client.guilds.cache
            .get(config.envConfig.devGuildId)
            ?.commands.fetch(command.id);

          fetchedCommand?.permissions.add({
            permissions,
          });
        }
      }
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
