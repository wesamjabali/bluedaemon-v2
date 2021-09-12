import { CommandInteraction, Role, User } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { updateCommandPermissions } from "@/helpers/addCommandPermissions.helper";
import { commands } from "@/commands";

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
        ["REMOVE", "SET"],
      ],
    },
    { type: "Mentionable", name: "user_role", required: true },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();
    const commandName = i.options.getString("command_name", true);
    const addRemove = i.options.getString("add_remove", true) as "ADD" | "SET";
    const userRole = i.options.getMentionable("user_role", true) as User | Role;
    let permission: CommandOptionPermission = {
      type: userRole instanceof User ? "USER" : "ROLE",
      permission: addRemove === "ADD" ? true : false,
      id: userRole.id,
    };

    if (userRole.id === i.user.id) {
      await i.followUp(`You can't change your own permissions.`);
      return;
    }

    if (!commands.find((c) => c.name === commandName)) {
      await i.followUp({
        content: `"${commandName}" is not a valid command.`,
        ephemeral: true,
      });
      return;
    }

    await updateCommandPermissions(addRemove, commandName, [permission]);
    await i.followUp({ content: "Permissions updated.", ephemeral: true });
  }
}
