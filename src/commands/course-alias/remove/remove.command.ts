import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { getGuildConfig } from "@/config/guilds.config";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { prisma } from "@/prisma/prisma.service";

export class RemoveCourseAliasCommand implements ICommand {
  name = "remove";
  description = "Remove an alias from a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "alias",
      description: "The alias to remove",
      required: true,
    },
    {
      type: "String",
      name: "quarter",
      description: "Name of the quarter this should take effect in",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    if (!guildConfig) return;

    let aliasToRemove = normalizeCourseCode(
      i.options.getString("alias", true)
    ).courseName;
    const quarterName = i.options.getString("quarter", false);
    let dbQuarter = guildConfig.currentQuarter ?? undefined;
    if (quarterName) {
      dbQuarter = guildConfig.quarters.find((q) => q.name === quarterName);
    }
    if (!dbQuarter) {
      return i.reply(`Quarter ${quarterName} doesn't exist.`);
    }

    const dbCourseIndex = guildConfig?.courses.findIndex(
      (c) => c.aliases.includes(aliasToRemove) && c.quarterId === dbQuarter?.id
    );

    if (dbCourseIndex === -1 || !dbCourseIndex) {
      return i.reply(`${aliasToRemove} doesn't exist.`);
    }

    guildConfig.courses[dbCourseIndex].aliases = guildConfig?.courses[
      dbCourseIndex
    ].aliases.filter((a) => a !== aliasToRemove);
    i.reply("Alias removed.");
    await prisma.course.update({
      where: { id: guildConfig?.courses[dbCourseIndex].id },
      data: { aliases: guildConfig?.courses[dbCourseIndex].aliases },
    });
  }
}
