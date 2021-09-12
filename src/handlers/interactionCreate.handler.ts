import {
  ClientEvents,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import { IEventHandler } from "./eventHandler.interface";
import { commands } from "@/commands";
import { buttons } from "@/buttons";
import { selectMenus } from "@/selectMenus";

export class InteractionCreateHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "interactionCreate";
  public async onEvent(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = commands.find((c) => c.name === interaction.commandName);
      if (command?.execute) {
        command.execute(interaction);
      } else {
        console.error(
          `ERROR: Unknown command called: "/${interaction.commandName}"\
If this is a subcommand/group, make sure to execute the correct subcommand!`
        );
      }
    }

    if (interaction.isButton()) {
      const button = buttons.find((b) => b.customId === interaction.customId);
      if (button && interaction.channel) {
        button.execute(interaction);
      } else {
        const rowComponent = (interaction.message as Message).components.find(
          (row) =>
            row.components.find((c) => c.customId === interaction.customId)
        );

        const buttonComponent = rowComponent?.components.find(
          (c) => c.customId === interaction.customId
        );

        if (buttonComponent) {
          (buttonComponent as MessageButton).setDisabled(true);
          (interaction.message as Message).edit({
            components: interaction.message.components as MessageActionRow[],
          });
        }

        interaction.reply({
          content: `Button with customId \`${interaction.customId}\` not implemented, ${interaction.user}.`,
          ephemeral: true,
        });
      }
    }

    if (interaction.isSelectMenu()) {
      const selectMenu = selectMenus.find(
        (sm) => sm.customId === interaction.customId
      );

      if (selectMenu) {
        selectMenu.execute(interaction);
      } else {
        const rowComponent = (interaction.message as Message).components.find(
          (row) =>
            row.components.find((c) => c.customId === interaction.customId)
        );

        const selectMenuComponent = rowComponent?.components.find(
          (c) => c.customId === interaction.customId
        );

        if (selectMenuComponent) {
          (selectMenuComponent as MessageSelectMenu).setDisabled(true);
          (interaction.message as Message).edit({
            components: interaction.message.components as MessageActionRow[],
          });
        }

        interaction.reply(
          `Select Menu with customId \`${interaction.customId}\` not implemented, ${interaction.user}.`
        );
      }
    }
  }
}
