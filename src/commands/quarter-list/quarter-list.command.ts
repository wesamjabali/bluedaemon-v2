import {
  CommandInteraction,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { displayList } from "@/services/display-list.service";

export class ListQuartersCommand implements ICommand {
  name = "quarter-list";
  description = "List all available quarters.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];
  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search term",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);

    i.deferReply();
    const searchTerm = i.options.getString("search", false)?.toLowerCase();
    let quarters = (
      guildConfig?.quarters.filter((q) => q.name.includes(searchTerm ?? "")) ||
      []
    ).map((q) => q.name);

    displayList(i, quarters, "Quarters", searchTerm);
  }
}
