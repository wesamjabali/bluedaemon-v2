import { CommandInteraction, Guild, Message, Role } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { logger } from "@/main";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { getGuildConfig } from "@/config/guilds.config";

export class CreateSelfRoleCommand implements ICommand {
  name = "role-create";
  description = "Create a self role";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "role_name",
      description: "Name of the role to create",
      required: true,
    },
    {
      type: "Role",
      name: "existing_role",
      description: "Optional role to map this name to.",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);

    let roleName = i.options.getString("role_name", true);
    let role = i.options.getRole("existing_role", false);

    if (
      guildConfig?.selfRoles.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      )
    ) {
      await i.reply(`${roleName} already exists!`);
      return;
    }

    if (!role) {
      role = (await i.guild?.roles.create({
        name: roleName,
        position: 0,
        reason: "Self-role created by BlueDaemon.",
      })) as Role;
    }

    await prisma.selfRole
      .create({
        data: { guildId: i.guildId as string, name: roleName, roleId: role.id },
      })
      .catch(async () => {
        const replyMessage = (await i.reply({
          content:
            "A self-role with that name already exists. The role was created, so you can just map it to another name.",
          fetchReply: true,
        })) as Message;

        logger.warn(
          i.guild,
          `${role} created by ${i.user}, self-role not registered because the name \`${roleName}\` was already taken.\n\nContext: ${replyMessage.url}`
        );
        return;
      });

    const replyMessage = (await i.reply({
      content: `${role} is now a self-role with name ${roleName}`,
      fetchReply: true,
    })) as Message;

    await resetCacheForGuild(i.guildId as string, "selfRoles");

    await logger.logToChannel(
      i.guild,
      `Self-role created by ${i.user}.\n${role}: ${roleName}.\n\nContext: ${replyMessage.url}`
    );
  }
}
