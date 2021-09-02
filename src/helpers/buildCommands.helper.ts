import { commands } from "../commands";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { config } from "../services/config.service";

export class BuildCommands {
  public async execute(): Promise<void> {
    const rest = new REST({ version: "9" }).setToken(config.envConfig.token);

    const JSONCommands: ICommandData[] = [];

    commands.forEach((command) => {
      JSONCommands.push(
        new SlashCommandBuilder()
          .setName(command.name)
          .setDescription(command.description)
          .toJSON()
      );
    });

    try {
      config.envConfig.environment === "production"
        ? await rest.put(
            Routes.applicationCommands(config.envConfig.clientId),
            {
              body: JSONCommands,
            }
          )
        : await rest.put(
            Routes.applicationGuildCommands(
              config.envConfig.clientId,
              config.envConfig.devGuildId
            ),
            {
              body: JSONCommands,
            }
          );
    } catch (error) {
      console.error(error);
    }

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
