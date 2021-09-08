import { ClientOptions, Intents } from "discord.js";
import dotenv from "dotenv";

export class ConfigService {
  constructor() {
    dotenv.config();
  }

  get envConfig(): EnvironmentConfig {
    return {
      token: <string>process.env.CLIENT_TOKEN,
      environment: <string>process.env.NODE_ENV,
      clientId: <string>process.env.CLIENT_ID,
      devGuildId: <string>process.env.DEV_GUILD_ID,
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
  environment: string;
  clientId: string;
  devGuildId: string;
}

export const config = new ConfigService();
