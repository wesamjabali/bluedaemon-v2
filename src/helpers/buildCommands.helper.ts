import { commands } from "../commands";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { config } from "../services/config.service";

export class BuildCommands {
  public execute() {
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
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(config.envConfig.clientId), {
          body: JSONCommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();

    console.log(`Built commands: ${JSONCommands.length}`);
  }
}

export interface ICommandData {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
  default_permission: boolean | undefined;
}
