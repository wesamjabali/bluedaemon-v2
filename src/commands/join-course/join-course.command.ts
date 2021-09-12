import { prisma } from "@/prisma/prisma.service";
import {
  CategoryChannel,
  CommandInteraction,
  GuildMemberRoleManager,
  Role,
  TextChannel,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { normalizeCourseCode } from "@/helpers/normalizeCourseCode.helper";
import { Course } from "@prisma/client";
import { joinCommandOptions } from "./join-course.options";
import { getRoleFromCourseName } from "@/helpers/getRoleFromCourseName.helper";
import { getGuildConfig } from "@/config/guilds.config";

export class JoinCourseCommand implements ICommand {
  name = "join-course";
  description = "Join a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  options: CommandOption[] = joinCommandOptions;

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    if (!guildConfig?.currentQuarterId || !i.guildId) return;
    const possibleAlias = normalizeCourseCode(
      i.options.getString("course", true)
    ).courseName;
    const password = i.options.getString("password", false);

    let dbCourse = await prisma.course.findFirst({
      where: {
        AND: {
          aliases: { has: possibleAlias },
          guildId: i.guildId,
          quarterId: guildConfig.currentQuarterId,
        },
      },
    });

    if (!dbCourse) {
      i.reply(`${possibleAlias} doesn't exist this quarter.`);
      return;
    }

    const dbQuarter = await prisma.quarter.findFirst({
      where: { id: guildConfig.currentQuarterId },
    });

    if (!dbQuarter) return;

    const courseRole = await getRoleFromCourseName(
      possibleAlias,
      dbQuarter,
      i.guildId
    );

    if (!courseRole) {
      prisma.course.delete({ where: { roleId: dbCourse.roleId } });
      i.reply(
        "That course role no longer exists! I removed it from the database."
      );

      return;
    }

    if (dbCourse.password) {
      if (!password) {
        i.reply({
          content: `This course is protected by a password! Please make sure you join using the password option. You have to click the "Password" option, a space is not sufficient.`,
          ephemeral: true,
        });
        return;
      }

      if (password !== dbCourse.password) {
        i.reply({
          content: `Wrong password for ${possibleAlias}. Please try again.`,
          ephemeral: true,
        });
        return;
      } else {
        if (await addRole(i, courseRole, possibleAlias)) {
          const courseChannel = await sendWelcomeMessage(
            i,
            dbCourse,
            courseRole
          );
          if (dbCourse.category) {
            i.reply({
              content: `${possibleAlias} added! You can view it here: ${courseChannel}`,
              ephemeral: true,
            });
          } else {
            i.reply({
              content: `${courseChannel} added!`,
              ephemeral: true,
            });
          }
        }
      }
    } else {
      /* If no password */
      if (!(await addRole(i, courseRole, possibleAlias))) {
        return;
      }
      const courseChannel = await sendWelcomeMessage(i, dbCourse, courseRole);

      await i.reply(`${courseChannel} added!`);
    }
  }
}

async function sendWelcomeMessage(
  i: CommandInteraction,
  dbCourse: Course,
  courseRole: Role
): Promise<TextChannel | null> {
  /* Send welcome message */
  let courseChannel;

  if (dbCourse.category) {
    const category = i.guild?.channels.cache.find(
      (c) => c.id === dbCourse?.channelId
    );
    if (!category) {
      await i.reply(
        "Original category no longer exists! Please update the database."
      );
    }

    courseChannel = (category as CategoryChannel).children.find(
      (c) => c.type === "GUILD_TEXT" && c.position === 0
    ) as TextChannel;
  } else {
    courseChannel = i.guild?.channels.cache.find(
      (c) => c.id === dbCourse?.channelId
    ) as TextChannel;
  }

  if (!courseChannel) {
    i.reply("Original channel no longer exists! Please update the database.");
    return null;
  }

  const roleMemberCount = courseRole.members.size + 1;

  courseChannel.send(
    `Welcome ${i.user}! There are now **${roleMemberCount}** people here. ` +
      `${roleMemberCount < 10 ? "Make sure you invite your classmates!" : ""}`
  );

  return courseChannel;
}

async function addRole(
  i: CommandInteraction,
  courseRole: Role,
  possibleAlias: string
): Promise<boolean> {
  if (
    (i.member?.roles as GuildMemberRoleManager).cache.find(
      (r) => r.id === courseRole.id
    )
  ) {
    if (i.replied) {
      await i.channel?.send(`You're already in ${possibleAlias}, ${i.user}.`);
    } else {
      await i.reply(`You're already in ${possibleAlias}, ${i.user}.`);
    }

    return false;
  }

  await (i.member?.roles as GuildMemberRoleManager).add(courseRole);
  return true;
}