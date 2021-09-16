import { IEventHandler } from "./event-handler.interface";
import { GuildCreateHandler } from "./guild-create.handler";
import { GuildMemberAddHandler } from "./guild-member-add.handler";
import { InteractionCreateHandler } from "./interaction-create.handler";
import { RateLimitHandler } from "./rate-limit.handler";
import { ReadyHandler } from "./ready.handler";

const handlers: IEventHandler[] = [
  new ReadyHandler(),
  new InteractionCreateHandler(),
  new GuildCreateHandler(),
  new RateLimitHandler(),
  new GuildMemberAddHandler()
];

export { handlers, ReadyHandler, InteractionCreateHandler, GuildCreateHandler };
