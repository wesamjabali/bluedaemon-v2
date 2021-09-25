import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";

export class ListQuartersCommand implements ICommand {
  name = "list-quarters";
  description = "List all available quarters.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];
  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search tags",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);

    i.deferReply();
    let pageNumber = 0;
    const searchTerm = i.options.getString("search", false)?.toLowerCase();
    let quarters = (
      guildConfig?.quarters.filter((q) => q.name.includes(searchTerm ?? "")) ||
      []
    ).map((q) => q.name);

    const buttons = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId("tag-list-back")
          .setStyle("PRIMARY")
          .setEmoji("⬅️")
          .setDisabled(true),
        new MessageButton()
          .setCustomId("tag-list-forward")
          .setStyle("PRIMARY")
          .setEmoji("➡️"),
      ]),
    ];
    const initialEmbed = getTagListEmbedPage(quarters, pageNumber, searchTerm);

    if (quarters.length <= 24) {
      i.followUp({ embeds: initialEmbed });
      return;
    }

    if (initialEmbed[0].fields.length !== 24) {
      buttons[0].components[1].setDisabled(true);
    }
    const sentReplyMessage = (await i.followUp({
      embeds: initialEmbed,
      components: buttons,
    })) as Message;

    const collector = sentReplyMessage.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 15000,
    });
    collector.on("collect", async (b) => {
      if (b.user.id !== i.user.id) {
        await b.reply({
          content: "You're not allowed to do that. Make your own search.",
          ephemeral: true,
        });
        return;
      }
      await b.reply({ content: "​" });
      await b.deleteReply();
      if (b.customId === "tag-list-back") {
        buttons[0].components[1].setDisabled(false);
        if (pageNumber - 1 === 0) {
          buttons[0].components[0].setDisabled(true);
        }
        i.editReply({
          embeds: getTagListEmbedPage(quarters, --pageNumber, searchTerm),
          components: buttons,
        });
      }
      if (b.customId === "tag-list-forward") {
        const embed = getTagListEmbedPage(quarters, ++pageNumber, searchTerm);
        buttons[0].components[0].setDisabled(false);
        if (embed[0].fields.length !== 24) {
          buttons[0].components[1].setDisabled(true);
        }
        i.editReply({
          embeds: embed,
          components: buttons,
        });
      }
    });
  }
}

function getTagListEmbedPage(
  tagList: string[],
  pageNumber: number,
  searchTerm?: string
): MessageEmbed[] {
  let filteredTags = tagList.slice(24 * pageNumber, 24);
  if (filteredTags.length === 0) {
    filteredTags = tagList.slice(24 * pageNumber);
  }

  let currentEmbed = new MessageEmbed();
  currentEmbed
    .setTitle("Quarters " + (searchTerm ? `with \`${searchTerm}\`` : ""))
    .setColor("BLUE");
  for (const t of filteredTags) {
    currentEmbed.addField(`\`${t}\``, "​", true);
  }

  return [currentEmbed];
}
