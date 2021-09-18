import {
  CommandInteraction,
  Guild,
  GuildMember,
  MemberMention,
  Role,
  User,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { updateCommandPermissions } from "@/helpers/add-command-permissions.helper";
import { commands } from "@/commands";

export class UpdatePermissionCommand implements ICommand {
  name = "update-permission";
  description = "Update command permission for a user or role.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "command_name",
      required: true,
      description:
        'Name of command to change the permission. Use "all" to set permissions for all commands.',
    },
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
    await i.deferReply();
    const commandName = i.options.getString("command_name", true).toLowerCase();
    const addRemove = i.options.getString("add_remove", true) as "ADD" | "REMOVE";
    const userRole = i.options.getMentionable("user_role", true) as
      | GuildMember
      | Role;
    let permission: CommandOptionPermission = {
      type: userRole instanceof GuildMember ? "USER" : "ROLE",
      permission: addRemove === "ADD" ? true : false,
      id: userRole.id,
    };

    if (commandName === "all") {
      for (const c of commands) {
        await updateCommandPermissions(
          addRemove,
          c.name,
          [permission],
          i.guild as Guild
        );
      }
      await i.followUp({ content: "Permissions updated.", ephemeral: true });
      return;
    }

    if (!commands.find((c) => c.name === commandName)) {
      await i.followUp({
        content: `"${commandName}" is not a valid command.`,
        ephemeral: true,
      });
      return;
    }

    await updateCommandPermissions(
      addRemove,
      commandName,
      [permission],
      i.guild as Guild
    );

    await i.followUp({ content: "Permissions updated.", ephemeral: true });
  }
}
