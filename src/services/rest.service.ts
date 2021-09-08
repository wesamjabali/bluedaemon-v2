import { REST } from "@discordjs/rest";
import { config } from "./config.service";

export const rest = new REST({ version: "9" }).setToken(config.envConfig.token);
