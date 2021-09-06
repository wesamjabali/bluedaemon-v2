import { prisma } from "../../../prisma/prisma.service";
import { normalizeCourseCode } from "../../../helpers/normalizeCourseCode.helper";
import {
  CategoryChannel,
  CategoryChannelResolvable,
  Channel,
  Guild,
  User,
} from "discord.js";
import { getGuildConfig } from "../../../config/guilds.config";

export async function createCourse(
  guild: Guild | null,
  courseCode: string,
  courseDescription: string | null,
  quarter: string | null,
  courseCategoryOption: boolean | null,
  courseOwner: User | null,
  password: string | null,
  linkedNameOption: string | null
): Promise<string> {
  if (!guild) return "Guild not found";
  const guildConfig = getGuildConfig(guild.id);
  if (!guildConfig?.currentQuarterName || !guild.id) {
    return "Cache failed to load.";
  }
  const { courseCodePrefix, courseCodeNumber, courseCodeSection, courseName } =
    normalizeCourseCode(courseCode);
  if (!courseCodePrefix || !courseCodeNumber) {
    return `Invalid course name, please use this template: **CSC300-401**`;
  }

  const courseAliases = linkedNameOption
    ? [courseName, normalizeCourseCode(linkedNameOption).courseName]
    : [courseName];
  let courseChannel;
  let doneString: string = "";
  quarter = quarter
    ? quarter.toLowerCase()
    : guildConfig.currentQuarterName.toLowerCase();

  if (
    !!(await prisma.course.findFirst({
      where: {
        aliases: { hasSome: courseAliases },
        guildId: guild.id,
        quarterName: quarter,
      },
    }))
  ) {
    return `${courseName} already exists!`;
  }

  //
  let dbQuarter = await prisma.quarter.findFirst({
    where: { name: quarter, Guild: { every: { guildId: guild.id } } },
  });

  if (!dbQuarter) {
    return `That quarter doesn't exist in the database. Available quarters are: \`\`\`${(
      await prisma.quarter.findMany({
        where: { Guild: { every: { guildId: guild.id } } },
        select: { name: true },
      })
    )
      .flatMap((c) => c.name)
      .join(", ")}\`\`\``;
  }
  //

  //
  const courseRole = await guild.roles.create({
    name: `${quarter}-${courseName}`,
    mentionable: false,
    reason: "Created by BlueDaemon as a course role.",
  });

  if (!courseRole) {
    return "Failed to create role.";
  }
  //

  let category: Channel | undefined;

  /* Create course into quarter category */
  //
  if (!courseCategoryOption) {
    for (const categoryId of dbQuarter.quarterCategoryChannelIds) {
      if (!category) {
        category = guild.channels.cache.find(
          (c) =>
            c.id === categoryId && (c as CategoryChannel).children.size < 50
        );
      }
    }

    if (!category) {
      category = await guild.channels.create(quarter, {
        reason: "Created by BlueDaemon as a quarter category.",
        type: "GUILD_CATEGORY",
      });

      if (!category?.id) {
        return "Failed to create category.";
      }

      await prisma.quarter.update({
        where: { name: quarter },
        data: {
          quarterCategoryChannelIds: dbQuarter.quarterCategoryChannelIds.concat(
            [category?.id]
          ),
        },
      });
    }

    courseChannel = await guild.channels.create(courseName, {
      parent: category as CategoryChannelResolvable,
      reason: "Created by BlueDaemon as a course channel.",
      permissionOverwrites: [
        { id: guild.id, deny: ["VIEW_CHANNEL"] },
        { id: courseRole.id, allow: ["VIEW_CHANNEL"] },
        {
          id: guildConfig.courseManagerRoleId as string,
          allow: [
            "VIEW_CHANNEL",
            "MANAGE_CHANNELS",
            "MANAGE_ROLES",
            "MANAGE_THREADS",
            "USE_PUBLIC_THREADS",
          ],
        },
        {
          id: guildConfig.moderatorRoleId as string,
          allow: [
            "VIEW_CHANNEL",
            "MANAGE_CHANNELS",
            "PRIORITY_SPEAKER",
            "MANAGE_EMOJIS_AND_STICKERS",
            "USE_PRIVATE_THREADS",
            "USE_PUBLIC_THREADS",
          ],
        },
      ],
    });

    if (courseOwner) {
      courseChannel?.permissionOverwrites.create(courseOwner, {
        MANAGE_MESSAGES: true,
        MANAGE_THREADS: true,
        PRIORITY_SPEAKER: true,
        MANAGE_CHANNELS: true,
        MANAGE_EMOJIS_AND_STICKERS: true,
        VIEW_CHANNEL: true,
      });
    }

    if (!courseChannel) {
      return "Failed to create channel.";
    }

    doneString = `${courseChannel} created!`;
  }
  //

  /* Create course category */

  //
  if (courseCategoryOption) {
    courseChannel = await guild.channels.create(`${quarter}-${courseName}`, {
      type: "GUILD_CATEGORY",
      permissionOverwrites: [
        { id: guild.id, deny: ["VIEW_CHANNEL"] },
        { id: courseRole.id, allow: ["VIEW_CHANNEL"] },
        {
          id: guildConfig.courseManagerRoleId as string,
          allow: [
            "VIEW_CHANNEL",
            "MANAGE_CHANNELS",
            "MANAGE_ROLES",
            "MANAGE_THREADS",
            "USE_PUBLIC_THREADS",
          ],
        },
        {
          id: guildConfig.moderatorRoleId as string,
          allow: [
            "VIEW_CHANNEL",
            "MANAGE_CHANNELS",
            "PRIORITY_SPEAKER",
            "MANAGE_EMOJIS_AND_STICKERS",
            "USE_PRIVATE_THREADS",
            "USE_PUBLIC_THREADS",
          ],
        },
      ],
    });

    const courseGeneralChannel = await guild.channels.create("general", {
      parent: courseChannel as CategoryChannelResolvable,
      reason: "Created by BlueDaemon as a course channel.",
    });

    await courseGeneralChannel?.lockPermissions();

    if (courseOwner) {
      courseChannel?.permissionOverwrites.create(courseOwner, {
        MANAGE_MESSAGES: true,
        MANAGE_THREADS: true,
        PRIORITY_SPEAKER: true,
        MANAGE_CHANNELS: true,
        MANAGE_EMOJIS_AND_STICKERS: true,
        VIEW_CHANNEL: true,
      });
    }

    if (!courseChannel || !courseGeneralChannel) {
      return "Failed to create channel.";
    }

    doneString = `${courseName} category created! View it here: ${courseGeneralChannel}`;
  }

  await prisma.course.create({
    data: {
      courseCodePrefix: courseCodePrefix,
      courseCodeNumber: courseCodeNumber,
      courseCodeSection: courseCodeSection,
      channelId: courseChannel?.id as string,
      description: courseDescription,
      quarter: {
        connect: { name: quarter },
      },
      category: courseCategoryOption ?? false,
      owner: courseOwner?.id,
      roleId: courseRole.id,
      guild: { connect: { guildId: guild.id } },
      password: password,
      aliases: courseAliases,
    },
  });
  //

  return doneString;
}
