import { logger } from "@/main";
import { ClientEvents, RateLimitData } from "discord.js";
import { IEventHandler } from "./event-handler.interface";

export class RateLimitHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "rateLimit";
  public onEvent = async (rateLimitData: RateLimitData) => {
    logger.warn(null, "Timeout: " + JSON.stringify(rateLimitData, null, 2));
  };
}
