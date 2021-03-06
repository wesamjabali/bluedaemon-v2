import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { displayList } from "@/services/display-list.service";

export class ListRolesCommand implements ICommand {
  name = "role-list";
  description = "List all roles";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
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

    await i.deferReply();
    const searchTerm = i.options.getString("search", false)?.toLowerCase();
    let roles = (
      guildConfig?.selfRoles.filter((r) =>
        r.name.toLowerCase().includes(searchTerm ?? "")
      ) || []
    ).map((r) => r.name);

    displayList(i, roles, "Self roles", searchTerm);
  }
}
