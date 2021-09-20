import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export class SetWelcomeRoleCommand implements ICommand {
  name = "set-welcome-role";
  description = "Set this server's role message to assign to all new members.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "role_name",
      required: false,
      description:
        "Name of the role to create. Leave blank to disable this feature.",
    },
    {
      type: "Role",
      name: "existing_role",
      description:
        "Map an existing role to assign to all new members. Leave blank to disable this feature.",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const newRoleName = i.options.getString("role_name", false);
    const existingRole = i.options.getRole("existing_role", false);
    let role = existingRole ?? undefined;

    if (newRoleName && !role) {
      role = await i.guild?.roles.create({ name: newRoleName });
    }

    await prisma.guild.update({
      where: { guildId: i.guildId as string },
      data: { communityPingRoleId: role?.id ?? null },
    });
    await resetCacheForGuild(i.guildId as string, "communityPingRoleId");
    await i.reply(`Welcome role set.`);
  }
}
