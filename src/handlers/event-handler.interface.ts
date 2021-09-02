import { ClientEvents } from "discord.js";

export interface IEventHandler {
  readonly EVENT_NAME: keyof ClientEvents;
  readonly once: boolean;

  onEvent(...args: ClientEvents[keyof ClientEvents]): void;
}
