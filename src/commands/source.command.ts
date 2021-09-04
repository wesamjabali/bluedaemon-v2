import { ButtonAction } from "@/buttons/ButtonAction.service";
import {
  CommandInteraction,
  Formatters,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { ICommand } from "./command.interface";

export class SourceCommand implements ICommand {
  name = "source";
  description = "Show my source code on GitHub!";
  default_permission = true;

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Check me out on GitHub!")
          .setURL("https://github.com/wesamjabali/bluedaemon-v2")
          .setImage(
            "https://github.com/wesamjabali/BlueDaemon/blob/main/assets/banner.png?raw=true"
          )
          .setFields({ name: "Author", value: "Wesam Jabali" })
          .setColor("BLUE"),
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setLabel("GitHub")
            .setURL("https://github.com/wesamjabali/bluedaemon-v2")
            .setStyle("LINK"),
        ]),
      ],
    });
  }
}
