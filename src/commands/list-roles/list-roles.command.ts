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

export class ListRolesCommand implements ICommand {
  name = "list-roles";
  description = "List all roles";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];
  buttonActions = [
    { customId: "role-list-back", execute: () => {} },
    { customId: "role-list-forward", execute: () => {} },
  ];
  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search roles",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);

    i.deferReply();
    let pageNumber = 0;
    const searchTerm = i.options.getString("search", false)?.toLowerCase();
    let roles = (
      guildConfig?.selfRoles.filter((r) =>
        r.name.toLowerCase().includes(searchTerm ?? "")
      ) || []
    ).map((r) => r.name);

    const buttons = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId("role-list-back")
          .setStyle("PRIMARY")
          .setEmoji("⬅️")
          .setDisabled(true),
        new MessageButton()
          .setCustomId("role-list-forward")
          .setStyle("PRIMARY")
          .setEmoji("➡️"),
      ]),
    ];
    const initialEmbed = getRoleListEmbedPage(roles, pageNumber, searchTerm);

    if (roles.length <= 24) {
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
      if (b.customId === "role-list-back") {
        buttons[0].components[1].setDisabled(false);
        if (pageNumber - 1 === 0) {
          buttons[0].components[0].setDisabled(true);
        }
        i.editReply({
          embeds: getRoleListEmbedPage(roles, --pageNumber, searchTerm),
          components: buttons,
        });
      }
      if (b.customId === "role-list-forward") {
        const embed = getRoleListEmbedPage(roles, ++pageNumber, searchTerm);
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

function getRoleListEmbedPage(
  roleList: string[],
  pageNumber: number,
  searchTerm?: string
): MessageEmbed[] {
  let filteredRoles = roleList.slice(24 * pageNumber, 24 * (pageNumber + 1));
  if (filteredRoles.length === 0) {
    filteredRoles = roleList.slice(24 * pageNumber);
  }

  let currentEmbed = new MessageEmbed();
  currentEmbed
    .setTitle("Roles " + (searchTerm ? `with \`${searchTerm}\`` : ""))
    .setColor("BLUE");
  for (const r of filteredRoles) {
    currentEmbed.addField(`\`${r}\``, "​", true);
  }

  return [currentEmbed];
}
