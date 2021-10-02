import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { getGuildConfig } from "@/config/guilds.config";
import { SelfRole } from ".prisma/client";

export class LeaveSelfRoleCommand implements ICommand {
  name = "leave-role";
  description = "Leave a self role";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "role_name",
      description: "Name of the role to leave",
      required: true,
    },
  ];

  async execute(i: CommandInteraction) {
    let roleName = i.options.getString("role_name", true);

    const guildConfig = getGuildConfig(i.guildId);

    const dbRole = guildConfig?.selfRoles.find((r) =>
      r.name.toLowerCase().startsWith(roleName.toLowerCase())
    ) ?? { roleId: "" };

    const roleId = dbRole.roleId;

    const role = i.guild?.roles.cache.find((r) => r.id === roleId);
    if (!role) {
      i.reply(
        `${roleName} not found. Use \`/list-roles\` for a list of all self-roles.`
      );
      return;
    }

    await (i.member?.roles as GuildMemberRoleManager).remove(role);

    await i.reply({
      content: `Left self-role ${(dbRole as SelfRole).name}!`,
    });
  }
}
