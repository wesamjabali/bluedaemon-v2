import { ButtonAction } from "@/buttons/buttonAction";
import { SelectMenuAction } from "@/selectMenus/selectMenuAction";
import { CommandInteraction } from "discord.js";
import {
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import {
  defaultComponents,
  deleteAllChannelsAndRoles,
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
    {
      customId: "test2",
      execute: async (interaction) => deleteAllChannelsAndRoles(interaction),
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
