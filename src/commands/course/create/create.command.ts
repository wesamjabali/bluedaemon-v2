import { prisma } from "../../../prisma/prisma.service";
import {
  CategoryChannel,
  CategoryChannelResolvable,
  Channel,
  CommandInteraction,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "../../command.interface";
import { getGuildConfig } from "../../../config/guilds.config";

export class CreateCourseCommand implements ICommand {
  name = "create";
  description = "Create a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { id: "796214872479498241", type: "ROLE", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "code",
      description: "CSC300-401",
      required: true,
    },
    {
      type: "String",
      name: "description",
      description: '"Intro to Programming I"',
      required: false,
    },
    {
      type: "Boolean",
      name: "category",
      description: "Create a course category",
      required: false,
    },
    {
      type: "User",
      name: "owner",
      description: "Give someone rights over this course",
      required: false,
    },
    {
      type: "String",
      name: "linked_name",
      description: "Link this course with another course name.",
      required: false,
    },
    {
      type: "String",
      name: "quarter",
      description: "Create this course in another quarter.",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    if (!guildConfig?.currentQuarterName || !i.guildId) {
      i.reply("Cache failed to load.");
      return;
    }
    const courseDescription = i.options.getString("description", false);
    const courseCode = i.options.getString("code", true);

    const courseCodePrefix = courseCode.match(/([a-zA-Z]+)/)?.at(0);
    const codeRegexNumbersIterator = courseCode.matchAll(/(\d+)/g);
    const courseCodeNumber = codeRegexNumbersIterator.next()?.value?.at(0);
    const courseCodeSection = codeRegexNumbersIterator.next()?.value?.at(0);

    const linkedNameOption = i.options.getString("linked_name");
    const password = i.options.getString("password", false);
    const courseCategoryOption = i.options.getBoolean("category", false);
    const courseOwner = i.options.getUser("owner", false);
    const courseName = `${courseCodePrefix}${courseCodeNumber}${
      courseCodeSection ? "-" : ""
    }${courseCodeSection ?? ""}`.toUpperCase();
    let courseChannel;
    const courseAliases = linkedNameOption
      ? [courseName, linkedNameOption]
      : [courseName];

    if (!courseCodePrefix || !courseCodeNumber) {
      i.reply(`Invalid course name, please use this template: **CSC300-401**`);
      return;
    }

    const courseExists = !!(await prisma.course.findFirst({
      where: {
        aliases: { hasSome: courseAliases },
      },
    }));

    if (courseExists) {
      i.reply(`${courseName} already exists!`);
      return;
    }

    let quarter =
      i.options.getString("quarter", false) ?? guildConfig.currentQuarterName;

    //
    let dbQuarter = await prisma.quarter.findFirst({
      where: { name: quarter },
    });

    if (!dbQuarter) {
      i.reply("That quarter doesn't exist.");
      return;
    }
    //

    //
    const courseRole = await i.guild?.roles.create({
      name: `${quarter}-${courseName}`,
      mentionable: false,
      reason: "Created by BlueDaemon as a course role.",
    });

    if (!courseRole) {
      i.reply("Failed to create role.");
      return;
    }
    //

    let category: Channel | undefined;

    /* Create course into quarter category */
    //
    if (!courseCategoryOption) {
      for (const categoryId of dbQuarter.quarterCategoryChannelIds) {
        if (!category) {
          category = i.guild?.channels.cache.find(
            (c) =>
              c.id === categoryId && (c as CategoryChannel).children.size < 50
          );
        }
      }

      if (!category) {
        category = await i.guild?.channels.create(quarter, {
          reason: "Created by BlueDaemon as a quarter category.",
          type: "GUILD_CATEGORY",
        });

        if (!category?.id) {
          i.reply("Failed to create category.");
          return;
        }

        await prisma.quarter.update({
          where: { name: quarter },
          data: {
            quarterCategoryChannelIds:
              dbQuarter.quarterCategoryChannelIds.concat([category?.id]),
          },
        });
      }

      courseChannel = await i.guild?.channels.create(courseName, {
        parent: category as CategoryChannelResolvable,
        reason: "Created by BlueDaemon as a course channel.",
        permissionOverwrites: [{ id: i.guildId, deny: ["VIEW_CHANNEL"] }],
      });

      if (courseOwner) {
        courseChannel?.permissionOverwrites.create(courseOwner, {
          MANAGE_MESSAGES: true,
          MANAGE_CHANNELS: true,
          MANAGE_EMOJIS_AND_STICKERS: true,
          VIEW_CHANNEL: true,
        });
      }

      if (!courseChannel) {
        await i.reply("Failed to create channel.");
        return;
      }

      await i.reply(`${courseChannel} created!`);
    }
    //

    /* Create course category */

    //
    if (courseCategoryOption) {
      courseChannel = await i.guild?.channels.create(courseName, {
        type: "GUILD_CATEGORY",
        permissionOverwrites: [
          { id: i.guildId, deny: ["VIEW_CHANNEL"] },
          { id: courseRole.id, allow: ["VIEW_CHANNEL"] },
        ],
      });

      const courseGeneralChannel = await i.guild?.channels.create("general", {
        parent: courseChannel as CategoryChannelResolvable,
        reason: "Created by BlueDaemon as a course channel.",
      });

      await courseGeneralChannel?.lockPermissions();

      if (courseOwner) {
        courseChannel?.permissionOverwrites.create(courseOwner, {
          MANAGE_MESSAGES: true,
          MANAGE_CHANNELS: true,
          MANAGE_EMOJIS_AND_STICKERS: true,
          VIEW_CHANNEL: true,
        });
      }

      if (!courseChannel || !courseGeneralChannel) {
        await i.reply("Failed to create channel.");
        return;
      }

      await i.reply(
        `${courseName} category created! View it here: ${courseGeneralChannel}`
      );
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
        guild: { connect: { guildId: i.guildId } },
        password: password,
        aliases: courseAliases,
      },
    });
    //
  }
}
