import {
  CommandOptionPermission,
  dynamicPermissionUserOrRole,
  PermissionRoles,
  UserOrRole,
} from "@/commands/command.interface";
import { client, logger } from "@/main";
import { AllApplicationCommands } from "@/services/application-commands.service";
import { config } from "@/services/config.service";

import {
  ApplicationCommand,
  ApplicationCommandPermissionData,
  Guild,
} from "discord.js";

export async function updateCommandPermissions(
  setAddRemove: "SET" | "ADD" | "REMOVE",
  applicationCommandName: string,
  permissions: CommandOptionPermission[],
  guild?: Guild,
  dynamicPermissionRoles?: PermissionRoles[]
) {
  if (permissions.length === 0) return;
  const allAppCommands = await new AllApplicationCommands().getAll();

  let applicationCommandId = allAppCommands?.find(
    (c) => c.name === applicationCommandName
  )?.id;

  if (!applicationCommandId) {
    return;
  }

  let applicationCommand: ApplicationCommand;
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
      logger.error(
        null,
        `Tried setting permission for ${p.type} on command ${applicationCommand.name}, but no id was passed.`
      );
      permissions.splice(permissions.indexOf(p), 1);
    }
  });

  if (permissions.length === 0) return;

  if (setAddRemove === "REMOVE") {
    for (const p of permissions) {
      if (config.envConfig.environment === "prod") {
        await guild?.commands.permissions.remove({
          command: applicationCommand,
          roles: [p.id as string],
          users: [p.id as string],
        });
      } else {
        await applicationCommand.permissions.remove({
          roles: [p.id as string],
          users: [p.id as string],
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
