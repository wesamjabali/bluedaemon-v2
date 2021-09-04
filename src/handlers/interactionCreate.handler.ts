import { ClientEvents, Interaction } from "discord.js";
import { IEventHandler } from "./eventHandler";
import { commands } from "../commands";
import { buttons } from "../buttons";
import { selectMenus } from "../selectMenus";

export class InteractionCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "interactionCreate";
  public async onEvent(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = commands.find((c) => c.name === interaction.commandName);
      if (command) {
        command.execute(interaction);
      } else {
        console.error("ERROR: Unknown command called.");
      }
    }

    if (interaction.isButton()) {
      const button = buttons.find((b) => b.customId === interaction.customId);
      if (button && interaction.channel) {
        button.execute(interaction);
      } else {
        interaction.reply(
          `Button with customId \`${interaction.customId}\` not implemented.`
        );
      }
    }

    if (interaction.isSelectMenu()) {
      const selectMenu = selectMenus.find(
        (sm) => sm.customId === interaction.customId
      );

      if (selectMenu) {
        selectMenu.execute(interaction);
      } else {
        interaction.update(
          `Select Menu with customId \`${interaction.customId}\` not implemented.`
        );
      }
    }
  }
}