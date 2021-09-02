import { ClientEvents, Interaction } from "discord.js";
import { IEventHandler } from "./event-handler.interface";
import { commands } from "../commands";

export class InteractionCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "interactionCreate";
  public onEvent = async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const command = commands.find((c) => c.name === interaction.commandName);

      command?.execute(interaction);
    }
  };
}
