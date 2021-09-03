import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  Routes,
} from "discord-api-types/v9";
import { config } from "../services/config.service";
import { ICommand } from "../commands/command.interface";

export class BuildCommands {
  public async execute(commandSet?: ICommand[]): Promise<void> {
    let commands: ICommand[] = [];
    const rest = new REST({ version: "9" }).setToken(config.envConfig.token);

    const JSONCommands: ICommandData[] = [];

    if (commandSet) {
      commands = commandSet;
    } else {
      commands = (await import("../commands")).commands;
    }

    commands.forEach((command) => {
      const newCommand = getCommandBuilder(
        command,
        false
      ) as SlashCommandBuilder;

      JSONCommands.push(newCommand.toJSON());
    });

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

    console.log(
      `Built commands: [${Array.from(JSONCommands, (command) => command.name)}]`
    );
  }
}

export function getCommandBuilder(
  command: ICommand,
  subCommand: boolean
): SlashCommandSubcommandBuilder | SlashCommandBuilder {
  var newCommand: SlashCommandBuilder | SlashCommandSubcommandBuilder;

  if (subCommand) {
    newCommand = new SlashCommandSubcommandBuilder();
  } else {
    newCommand = new SlashCommandBuilder();
  }

  newCommand.setName(command.name);
  newCommand.setDescription(command.description);

  for (const currentOption of command.options) {
    if (currentOption.type === ApplicationCommandOptionType.String) {
      newCommand.addStringOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
          .addChoices(
            (currentOption.choices as [name: string, value: string][]) || []
          )
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.Integer) {
      newCommand.addIntegerOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
          .addChoices(
            (currentOption.choices as [name: string, value: number][]) || []
          )
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.Number) {
      newCommand.addNumberOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
          .addChoices(
            (currentOption.choices as [name: string, value: number][]) || []
          )
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.Boolean) {
      newCommand.addBooleanOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.User) {
      newCommand.addUserOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.Channel) {
      newCommand.addChannelOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.Mentionable) {
      newCommand.addMentionableOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
      );
    }

    if (currentOption.type === ApplicationCommandOptionType.Role) {
      newCommand.addRoleOption((option) =>
        option
          .setName(currentOption.name ?? "Missing Name")
          .setDescription(currentOption.description ?? "Missing Description")
          .setRequired(currentOption.required ?? false)
      );
    }

    if (!subCommand) {
      if (currentOption.type === ApplicationCommandOptionType.Subcommand) {
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
  }

  return newCommand;
}

export interface ICommandData {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
  default_permission: boolean | undefined;
}
