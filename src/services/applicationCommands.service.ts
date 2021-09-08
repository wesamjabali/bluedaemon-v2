import { client } from "@/main";
import { Routes } from "discord-api-types/v9";
import { ApplicationCommand } from "discord.js";
import { config } from "./config.service";
import { rest } from "./rest.service";

export class AllApplicationCommands {
  async getAll() {
    let commands: ApplicationCommand[] = [];
    if (config.envConfig.environment === "prod") {
      commands = (await rest.get(
        Routes.applicationCommands(config.envConfig.clientId)
      )) as ApplicationCommand[];
    } else {
      if (
        !client.guilds.cache.find((g) => g.id === config.envConfig.devGuildId)
      ) {
        console.log("Commands not built - bot is not in dev guild.");
        return;
      }
      commands = (await rest.get(
        Routes.applicationGuildCommands(
          config.envConfig.clientId,
          config.envConfig.devGuildId
        )
      )) as ApplicationCommand[];
    }

    return commands;
  }
}
