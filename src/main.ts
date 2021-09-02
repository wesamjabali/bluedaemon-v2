import { Client } from "discord.js";
import { handlers } from "./handlers";
import { clientOptions, config } from "./services/config.service";

const client = new Client(clientOptions);

handlers.forEach((handler) => {
  if (handler.once) {
    client.once(handler.EVENT_NAME, (...args) => handler.onEvent());
  } else {
    client.on(handler.EVENT_NAME, (...args) => handler.onEvent());
  }
});

client.login(config.envConfig.token);
