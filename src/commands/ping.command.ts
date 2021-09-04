import { ButtonAction } from "../buttons/ButtonAction.service";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import { ICommand } from "./command.interface";
import { SelectMenuAction } from "../selectMenus/SelectMenu.service";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;
  selectMenuActions: SelectMenuAction[] = [
    {
      customId: "pingmenu",
      execute: async (i) => {
        await i.reply(
          `${i.user} clicked the option with value: **${i.values[0]}**`
        );
      },
    },
  ];
  buttonActions: ButtonAction[] = [
    {
      customId: "button1",
      execute: async (i) => {
        i.reply("Pressed!");
      },
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
    const replyTime = new Date();

    await interaction.editReply({
      content: `Pong! Message -> Bot Server in ${
        replyTime.getTime() - interaction.createdTimestamp
      }ms`,
      components: [
        new MessageActionRow().addComponents([
          new MessageSelectMenu()
            .setCustomId(this.selectMenuActions[0].customId)
            .addOptions([
              {
                label: "First Option",
                description: "Hello world",
                value: "myValue1",
              },
              {
                label: "Second Option",
                description: "Hello world 2!!",
                value: "myValue2",
              },
            ]),
          new MessageSelectMenu()
            .setCustomId(this.selectMenuActions[1]?.customId ?? "secondone")
            .addOptions([
              {
                label: "First Option",
                description: "Hello world",
                value: "myValue1",
              },
              {
                label: "Second Option",
                description: "Hello world 2!!",
                value: "myValue2",
              },
            ]),
        ]),
      ],
    });
  }
}
