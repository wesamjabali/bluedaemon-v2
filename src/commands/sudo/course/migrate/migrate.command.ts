import { CategoryChannel, CommandInteraction, TextChannel } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";
import { getGuildConfig } from "@/config/guilds.config";
import { Course } from ".prisma/client";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";

export class MigrateCommand implements ICommand {
  name = "migrate";
  description = "Register existing courses to a quarter.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    { type: "Channel", name: "category", required: true },
    {
      type: "Boolean",
      name: "quarter_category",
      required: true,
      description: "True if you're selecting an entire quarter category.",
    },
  ];

  async execute(i: CommandInteraction) {
    const categoryChannel = i.options.getChannel("category", true);
    const isQuarterCategoryChannel = i.options.getBoolean(
      "quarter_category",
      true
    );
    i.deferReply();
    const guildConfig = getGuildConfig(i.guildId);
    if (!i.guildId || !i.guild || !i.guild?.ownerId) return;
    if (!(categoryChannel instanceof CategoryChannel)) {
      i.followUp("Select a category channel.");
      return;
    }
    let quarterName: string = categoryChannel.name
      .matchAll(/([^-]*)/g)
      .next()
      .value?.shift()
      ?.toLowerCase();

    let existingDbQuarter = guildConfig?.quarters.find(
      (q) => q.name.toLowerCase() === quarterName
    );

    if (!existingDbQuarter) {
      i.followUp(
        `The quarter, \`${quarterName}\` doesn't exist. Run /sudo course update-quarter to create a new quarter.`
      );
      return;
    }

    const allCategoryChannelsForQuarter =
      existingDbQuarter.quarterCategoryChannelIds;

    let failedImports: string[] = [];
    let courses: Course[] = [];

    if (isQuarterCategoryChannel) {
      for (const c of categoryChannel.children.values()) {
        const existingRole = i.guild.roles.cache.find(
          (r) =>
            r.name.toLowerCase() === `${quarterName}-${c.name}`.toLowerCase()
        );

        if (existingRole) {
          let newCourse: Partial<Course> = {};

          newCourse.aliases = [normalizeCourseCode(c.name).courseName];
          newCourse.category = false;
          newCourse.channelId = c.id;
          newCourse.guildId = c.guildId;
          newCourse.quarterId = existingDbQuarter.id;
          newCourse.roleId = existingRole.id;

          courses.push(newCourse as Course);
        } else {
          failedImports.push(c.name);
        }
      }
      allCategoryChannelsForQuarter.push(categoryChannel.id);
      await prisma.quarter.update({
        where: { id: existingDbQuarter.id },
        data: { quarterCategoryChannelIds: allCategoryChannelsForQuarter },
      });
    } else {
      //create 1 new course of a category course.
      const existingRole = i.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === categoryChannel.name.toLowerCase()
      );

      const courseName = categoryChannel.name
        .matchAll(/-(.+)/g)
        .next()
        ?.value?.slice(-1)
        ?.shift();

      if (existingRole) {
        let newCourse: Partial<Course> = {};

        newCourse.aliases = [normalizeCourseCode(courseName).courseName];
        newCourse.category = true;
        newCourse.channelId = categoryChannel.id;
        newCourse.guildId = categoryChannel.guildId;
        newCourse.quarterId = existingDbQuarter.id;
        newCourse.roleId = existingRole.id;

        courses.push(newCourse as Course);
      } else {
        failedImports.push(courseName);
      }
    }

    let errorFlag = false;
    await prisma.course.createMany({ data: courses }).catch(() => {
      i.followUp("Duplicate course(s) found. Please try again.");
      resetCacheForGuild(i.guildId as string);
      errorFlag = true;
    });
    if (errorFlag) return;

    await resetCacheForGuild(i.guildId);

    await i.followUp(
      `${
        courses.length > 0
          ? `Successful imports: \`\`\`${courses
              .map((m) => m.aliases[0])
              .join("\n")}\`\`\``
          : ""
      }
        ${
          failedImports.length > 0
            ? `\n\nFailed imports: (Due to the role name not matching the quarter-channelname123) ${failedImports.join(
                "\n"
              )}\`\`\``
            : ""
        }.
      `
    );
  }
}
