import { IEventHandler } from "./event-handler.interface";
import { InteractionCreateHandler } from "./interactionCreate";
import { ReadyHandler } from "./ready.handler";

const handlers: IEventHandler[] = [
  new ReadyHandler(),
  new InteractionCreateHandler(),
];

export { handlers, ReadyHandler, InteractionCreateHandler };
