import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { getGuildConfig } from "@/config/guilds.config";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { prisma } from "@/prisma/prisma.service";

export class AddCourseAliasCommand implements ICommand {
  name = "add";
  description = "Add an alias to a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "course",
      description: "Name of the course to add the alias to",
      required: true,
    },
    {
      type: "String",
      name: "alias",
      description: "The new alias",
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
    let courseName = normalizeCourseCode(
      i.options.getString("course", true)
    ).courseName;
    let newAlias = normalizeCourseCode(i.options.getString("alias", true));
    const quarterName = i.options.getString("quarter", false);
    let dbQuarter = guildConfig?.currentQuarter;
    if (quarterName) {
      dbQuarter = guildConfig?.quarters.find((q) => q.name === quarterName);
    }
    if (!dbQuarter) {
      return i.reply(`Quarter ${quarterName} doesn't exist.`);
    }
    if (!newAlias.courseCodeNumber || !newAlias.courseCodePrefix) {
      return i.reply(`Invalid alias, please use this template: **CSC300-401**`);
    }
    const existingAlias = guildConfig?.courses.find(
      (c) =>
        c.aliases.includes(newAlias.courseName) && c.quarterId === dbQuarter?.id
    );
    if (existingAlias) {
      return i.reply(
        `That alias is already exists for course ${existingAlias.aliases.join(
          "/"
        )}, found here: <#${
          existingAlias.category
            ? existingAlias.roleId
            : existingAlias.channelId
        }>`
      );
    }

    const dbCourseIndex = guildConfig?.courses.findIndex(
      (c) => c.aliases.includes(courseName) && c.quarterId === dbQuarter?.id
    );

    if (dbCourseIndex === -1 || !dbCourseIndex) {
      return i.reply(`${courseName} doesn't exist.`);
    }

    guildConfig?.courses[dbCourseIndex].aliases.push(newAlias.courseName);
    i.reply("Alias added.");
    await prisma.course.update({
      where: { id: guildConfig?.courses[dbCourseIndex].id },
      data: { aliases: guildConfig?.courses[dbCourseIndex].aliases },
    });
  }
}
