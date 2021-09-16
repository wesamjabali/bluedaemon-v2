import {
  CommandOptionPermission,
  dynamicPermissionUserOrRole,
  PermissionRoles,
  UserOrRole,
} from "@/commands/command.interface";
import { client } from "@/main";
import { AllApplicationCommands } from "@/services/applicationCommands.service";
import { config } from "@/services/config.service";

import {
  ApplicationCommand,
  ApplicationCommandPermissionData,
  Guild,
  RoleResolvable,
  UserResolvable,
} from "discord.js";

export async function updateCommandPermissions(
  setAddRemove: "SET" | "ADD" | "REMOVE",
  applicationCommandName: string,
  permissions: CommandOptionPermission[],
  dynamicPermissionRoles?: PermissionRoles[],
  guild?: Guild
) {
  if (permissions.length === 0) return;
  const allAppCommands = await new AllApplicationCommands().getAll();

  let applicationCommandId = allAppCommands?.find(
    (c) => c.name === applicationCommandName
  )?.id;

  if (!applicationCommandId) {
    return;
  }

  let applicationCommand;
  /* Get command from discord server */
  if (config.envConfig.environment === "prod") {
    applicationCommand = (await client.application?.commands.fetch(
      applicationCommandId
    )) as ApplicationCommand;
  } else {
    applicationCommand = (await client.guilds.cache
      .get(config.envConfig.devGuildId)
      ?.commands.fetch(applicationCommandId)) as ApplicationCommand;
  }
  /* Loop through all dynamic permissions and turn them into users and roles given from the permissionRoles parameter. */
  permissions = permissions.map((currentPerm) => {
    const type = dynamicPermissionUserOrRole[currentPerm.type] as UserOrRole;

    const roleId =
      dynamicPermissionRoles?.find((rI) => rI.roleType === currentPerm.type)
        ?.id ?? currentPerm.id;

    currentPerm = {
      type: type,
      id: roleId,
      permission: currentPerm.permission,
    };

    return currentPerm;
  });

  permissions.forEach((p) => {
    if ((p.type !== "ROLE" && p.type !== "USER") || !p.id) {
      permissions.splice(permissions.indexOf(p), 1);
    }
  });

  if (permissions.length === 0) return;

  if (setAddRemove === "REMOVE") {
    for (const p of permissions) {
      if (p.type === "ROLE") {
        applicationCommand.permissions.remove({
          roles: [p.id as RoleResolvable],
        });
      } else {
        applicationCommand.permissions.remove({
          users: [p.id as UserResolvable],
        });
      }
    }
  } else if (setAddRemove === "ADD") {
    if (config.envConfig.environment === "prod") {
      await guild?.commands.permissions.add({
        command: applicationCommand,
        permissions: permissions as ApplicationCommandPermissionData[],
      });
    } else {
      await applicationCommand.permissions.add({
        permissions: permissions as ApplicationCommandPermissionData[],
      });
    }
  } else {
    if (config.envConfig.environment === "prod") {
      await guild?.commands.permissions.set({
        command: applicationCommand,
        permissions: permissions as ApplicationCommandPermissionData[],
      });
    } else {
      await applicationCommand.permissions.set({
        permissions: permissions as ApplicationCommandPermissionData[],
      });
    }
  }
}
