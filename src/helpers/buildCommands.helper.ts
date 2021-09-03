import { commands } from "../commands";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { config } from "../services/config.service";
import { StringOption } from "@/commands/command.interface";

export class BuildCommands {
  public async execute(): Promise<void> {
    const rest = new REST({ version: "9" }).setToken(config.envConfig.token);

    const JSONCommands: ICommandData[] = [];

    commands.forEach((command) => {
      const newCommand = new SlashCommandBuilder();
      newCommand.setName(command.name);
      newCommand.setDescription(command.description);

      /* Attach string options */
      for (const stringOption of command.options.stringOptions) {
        newCommand.addStringOption((option) =>
          option
            .setName(stringOption.name)
            .setDescription(stringOption.description)
            .setRequired(stringOption.required)
            .addChoices(stringOption.choices)
        );
      }
      /* Attach integer options */
      for (const integerOption of command.options.integerOptions) {
        newCommand.addIntegerOption((option) =>
          option
            .setName(integerOption.name)
            .setDescription(integerOption.description)
            .setRequired(integerOption.required)
            .addChoices(integerOption.choices)
        );
      }

      JSONCommands.push(newCommand.toJSON());
    });

    config.envConfig.environment === "production"
      ? await rest.put(Routes.applicationCommands(config.envConfig.clientId), {
          body: JSONCommands,
        })
      : await rest.put(
          Routes.applicationGuildCommands(
            config.envConfig.clientId,
            config.envConfig.devGuildId
          ),
          {
            body: JSONCommands,
          }
        );

    console.log(
      `Built commands: [${Array.from(JSONCommands, (command) => command.name)}]`
    );
  }
}

export interface ICommandData {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
  default_permission: boolean | undefined;
}
