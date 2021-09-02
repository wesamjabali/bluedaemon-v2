import { BuildCommands } from "../helpers/buildCommands.helper";
import { ClientEvents } from "discord.js";
import { IEventHandler } from "./event-handler.interface";

export class ReadyHandler implements IEventHandler {
  public once = true;
  public readonly EVENT_NAME: keyof ClientEvents = "ready";
  public onEvent = () => {
    new BuildCommands().execute();
    console.log("ready");
  };
}
