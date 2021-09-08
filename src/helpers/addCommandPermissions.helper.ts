import {
  CommandOptionPermission,
  dynamicPermissionUserOrRole,
  PermissionRoles,
  UserOrRole,
} from "@/commands/command.interface";
import { client } from "@/main";
import { config } from "@/services/config.service";

import {
  ApplicationCommand,
  ApplicationCommandPermissionData,
} from "discord.js";

export async function addCommandPermissions(
  applicationCommand: ApplicationCommand<{}>,
  permissions: CommandOptionPermission[],
  dynamicPermissionRoles?: PermissionRoles[]
) {
  if (
    permissions.length === 0 ||
    !dynamicPermissionRoles ||
    dynamicPermissionRoles.length === 0
  )
    return;

  /* Get command from discord server */
  if (config.envConfig.environment === "production") {
    applicationCommand = (await client.application?.commands.fetch(
      applicationCommand.id
    )) as ApplicationCommand;
  } else {
    applicationCommand = (await client.guilds.cache
      .get(config.envConfig.devGuildId)
      ?.commands.fetch(applicationCommand.id)) as ApplicationCommand;
  }
  /* Loop through all dynamic permissions and turn them into users and roles given from the permissionRoles parameter. */
  permissions = permissions.map((currentPerm) => {
    const type = dynamicPermissionUserOrRole[currentPerm.type] as UserOrRole;

    const roleId =
      dynamicPermissionRoles.find((rI) => rI.roleType === currentPerm.type)
        ?.id ?? currentPerm.id;

    currentPerm = {
      type: type,
      id: roleId,
      permission: currentPerm.permission,
    };

    return currentPerm;
  });

  permissions.forEach((p) => {
    if (p.type !== "ROLE" && p.type !== "USER") {
      permissions.splice(permissions.indexOf(p), 1);
    }
  });

  await applicationCommand.permissions.add({
    permissions: permissions as ApplicationCommandPermissionData[],
  });
}
