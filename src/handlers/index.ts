import { IEventHandler } from "./eventHandler.interface";
import { GuildCreateHandler } from "./guildCreate.handler";
import { InteractionCreateHandler } from "./interactionCreate.handler";
import { RateLimitHandler } from "./rateLimit.handler";
import { ReadyHandler } from "./ready.handler";

const handlers: IEventHandler[] = [
  new ReadyHandler(),
  new InteractionCreateHandler(),
  new GuildCreateHandler(),
  new RateLimitHandler(),
];

export { handlers, ReadyHandler, InteractionCreateHandler, GuildCreateHandler };
