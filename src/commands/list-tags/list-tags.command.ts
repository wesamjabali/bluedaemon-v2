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
import { displayList } from "@/services/display-list.service";

export class ListTagsCommand implements ICommand {
  name = "list-tags";
  description = "List all tags";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];
  buttonActions = [
    { customId: "tag-list-back", execute: () => {} },
    { customId: "tag-list-forward", execute: () => {} },
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
    const searchTerm = i.options.getString("search", false)?.toLowerCase();
    let tags = (
      guildConfig?.tags.filter((t) => t.name.includes(searchTerm ?? "")) || []
    ).map((t) => t.name);

    displayList(i, tags, "Tags", searchTerm);
  }
}
