import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { getGuildConfig } from "@/config/guilds.config";

export class JoinSelfRoleCommand implements ICommand {
  name = "join-role";
  description = "Join a self role";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "role_name",
      description: "Name of the role to join",
      required: true,
    },
  ];

  async execute(i: CommandInteraction) {
    let roleName = i.options.getString("role_name", true);

    const guildConfig = getGuildConfig(i.guildId);

    const roleId =
      guildConfig?.selfRoles.find((r) => r.name === roleName)?.roleId ?? "";

    const role = i.guild?.roles.cache.find((r) => r.id === roleId);
    if (!role) {
      i.reply(
        `${roleName} not found. Use \`/list-roles\` for a list of all self-roles.`
      );
      return;
    }

    await (i.member?.roles as GuildMemberRoleManager).add(role);

    await i.reply({
      content: `Joined self-role ${roleName}!`,
    });
  }
}
