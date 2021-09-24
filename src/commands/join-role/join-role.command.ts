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
      guildConfig?.selfRoles.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      )?.roleId ?? "";

    const role = i.guild?.roles.cache.find((r) => r.id === roleId);
    if (!role) {
      i.reply(
        `${roleName} not found. Use \`/list-roles\` for a list of all self-roles.`
      );
      return;
    }

    let errorFlag = false;
    await (i.member?.roles as GuildMemberRoleManager).add(role).catch(() => {
      i.reply(
        `<@${i.guild?.ownerId}>, please make sure the BlueDaemon role is ordered above all other roles. https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101`
      );
      errorFlag = true;
    });

    if (errorFlag) return;

    await i.reply({
      content: `Joined self-role ${roleName}!`,
    });
  }
}
