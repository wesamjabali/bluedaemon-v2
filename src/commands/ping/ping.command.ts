import { ButtonAction } from "../../buttons/buttonAction.service";
import { SelectMenuAction } from "../../selectMenus/selectMenuAction.service";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../command.interface";
import {
  defaultComponents,
  myPingSelectAction,
  testButton,
} from "./ping.service";

export class PingCommand implements ICommand {
  name = "ping";
  description = "Pong!";
  default_permission = true;

  buttonActions: ButtonAction[] = [
    {
      customId: "ping-button1",
      execute: async (interaction) => testButton(interaction),
    },
  ];
  selectMenuActions: SelectMenuAction[] = [
    {
      customId: "ping-myselect",
      execute: (interaction) => myPingSelectAction(interaction),
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");

    const replyTime = new Date();
    const components = defaultComponents;

    await interaction.editReply({
      content: `Pong! Message -> Bot Server in ${
        replyTime.getTime() - interaction.createdTimestamp
      }ms`,
      components: components,
    });
  }
}
