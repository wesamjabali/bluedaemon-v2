import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

import { resetCacheForGuild } from "@/helpers/resetCacheForGuild.helper";
import { commands } from "@/commands";
import { updateCommandPermissions } from "@/helpers/addCommandPermissions.helper";

export class UpdatePermissionCommand implements ICommand {
  name = "update-permission";
  description = "Update command permission for a user or role.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    { type: "String", name: "command_name", required: true },
    {
      type: "String",
      name: "add_remove",
      required: true,
      choices: [
        ["ADD", "ADD"],
        ["REMOVE", "REMOVE"],
      ],
    },
    { type: "Mentionable", name: "user_role", required: true },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();

    const currentQuarter = i.options.getString("current_quarter", true);
  }
}
