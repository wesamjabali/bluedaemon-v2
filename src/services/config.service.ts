import { ClientOptions, Intents } from "discord.js";
import dotenv from "dotenv";

export class ConfigService {
  constructor() {
    dotenv.config();
  }

  get envConfig(): EnvironmentConfig {
    return {
      token: <string>process.env.CLIENT_TOKEN,
      clientId: "820141085014753321",
      devGuildId: "753687465784770630",
    };
  }
}

export const clientOptions: ClientOptions = {
  intents: [Intents.FLAGS.GUILDS],
  presence: {
    status: "online",
    activities: [
      { name: "BlueDaemon", type: "PLAYING", url: "https://wesamjabali.com" },
    ],
  },
};

export interface EnvironmentConfig {
  token: string;
  clientId: string;
  devGuildId: string;
}

export const config = new ConfigService();
