import { CommandInteraction, Message, Role } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { logger } from "@/main";
import { prisma } from "@/prisma/prisma.service";
import { getGuildConfig } from "@/config/guilds.config";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class DeleteSelfRoleCommand implements ICommand {
  name = "delete-role";
  description = "Delete a self role";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "role_name",
      description: "Name of the role to delete",
      required: true,
    },
    {
      type: "Boolean",
      name: "preserve_role",
      description:
        "True if you don't want to delete the actual role from the server",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    let roleName = i.options.getString("role_name", true);
    let preserveRole = i.options.getBoolean("preserve_role", false) ?? false;

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

    await prisma.selfRole.delete({
      where: { roleId: roleId },
    });

    if (!preserveRole) role.delete();
    resetCacheForGuild(i.guildId as string, "selfRoles");

    const replyMessage = (await i.reply({
      content: `Deleted self-role ${roleName}`,
      fetchReply: true,
    })) as Message;

    logger.info(
      i.guild,
      `Self-role deleted by ${i.user}: ${roleName}.\n\nContext: ${replyMessage.url}`
    );
  }
}
