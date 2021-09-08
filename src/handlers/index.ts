import { IEventHandler } from "./eventHandler.interface";
import { GuildCreateHandler } from "./guildCreate.handler";
import { InteractionCreateHandler } from "./interactionCreate.handler";
import { ReadyHandler } from "./ready.handler";

const handlers: IEventHandler[] = [
  new ReadyHandler(),
  new InteractionCreateHandler(),
  new GuildCreateHandler(),
];

export { handlers, ReadyHandler, InteractionCreateHandler, GuildCreateHandler };
