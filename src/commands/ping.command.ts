import { ButtonAction } from "../buttons/buttonAction.service";
import { SelectMenuAction } from "../selectMenus/selectMenuAction.service";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import { ICommand } from "./command.interface";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;
  buttonActions: ButtonAction[] = [
    {
      customId: "ping-button1",
      execute: async (interaction) => {
        interaction.message.components?.forEach((row) =>
          row.components.forEach((component) => {
            (component as MessageButton).setDisabled(true);
          })
        );

        (interaction.message as Message).edit({
          components: interaction.message.components as MessageActionRow[],
        });

        interaction.reply(`${interaction.user} pressed the button!`);
      },
    },
  ];

  selectMenuActions: SelectMenuAction[] = [
    {
      customId: "ping-myselect",
      execute: (selectMenuInteraction) => {
        selectMenuInteraction.reply(
          `${selectMenuInteraction.user} pressed the option with value **${selectMenuInteraction.values[0]}**`
        );
      },
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const replyTime = new Date();
    const components = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId(this.buttonActions[0].customId)
          .setStyle("SUCCESS")
          .setLabel("Test"),
        new MessageButton()
          .setCustomId("test2")
          .setStyle("DANGER")
          .setLabel("Unimplemented Button"),
      ]),
      new MessageActionRow().addComponents([
        new MessageSelectMenu()
          .setCustomId(this.selectMenuActions[0].customId)
          .addOptions([
            {
              label: "First option",
              value: "first",
              description: "This is the first opton available.",
              emoji: "1️⃣",
            },
            {
              label: "Second option",
              value: "second",
              description: "This is the second opton available.",
              emoji: "2️⃣",
            },
            {
              label: "Third option",
              value: "third",
              description: "This is the third opton available.",
              emoji: "3️⃣",
            },
          ]),
      ]),
    ];

    await interaction.editReply({
      content: `Pong! Message -> Bot Server in ${
        replyTime.getTime() - interaction.createdTimestamp
      }ms`,
      components: components,
    });
  }
}
