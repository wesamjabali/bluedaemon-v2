import { prisma } from "../../../prisma/prisma.service";
import {
  CategoryChannel,
  CommandInteraction,
  GuildMemberRoleManager,
  Role,
  TextChannel,
} from "discord.js";
import { CommandOption, ICommand } from "../../command.interface";
import { normalizeCourseCode } from "../../../helpers/normalizeCourseCode.helper";
import { Course } from "@prisma/client";

export class JoinCourseCommand implements ICommand {
  name = "join";
  description = "Join a course";
  default_permission = true;

  options: CommandOption[] = [
    {
      type: "String",
      name: "course",
      description: "ex: CSC300-401 - Name of the course you'd like to join.",
      required: true,
    },
    {
      type: "String",
      name: "password",
      description: "Password given to you by your professor.",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const possibleAlias = normalizeCourseCode(
      i.options.getString("course", true)
    ).courseName;
    const password = i.options.getString("password", false);

    let dbCourse = await prisma.course.findFirst({
      where: { aliases: { has: possibleAlias } },
    });

    if (!dbCourse) {
      dbCourse = await prisma.course.findFirst({
        where: { aliases: { has: possibleAlias } },
      });
    }

    if (!dbCourse) {
      i.reply(`${possibleAlias} doesn't exist this quarter.`);
      return;
    }

    const courseRole = i.guild?.roles.cache.find(
      (role) => role.id === dbCourse!.roleId
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
        i.reply(
          `This course is protected by a password! Please make sure you join using the password.`
        );
        return;
      }

      if (password !== dbCourse.password) {
        i.channel?.send(
          `Wrong password for ${possibleAlias}. Please try again, ${i.user}`
        );
      } else {
        if (await addRole(i, courseRole, possibleAlias)) {
          const courseChannel = await sendWelcomeMessage(
            i,
            dbCourse,
            courseRole
          );
          if (dbCourse.category) {
            i.channel?.send(
              `${possibleAlias} added, ${i.user}! You can view it here: ${courseChannel}`
            );
          } else {
            i.channel?.send(`${courseChannel} added, ${i.user}!`);
          }
        } else {
          return;
        }
      }

      await i.reply("​"); // Zero widthspace character (​)
      await i.deleteReply();

      return;
    }

    if (!(await addRole(i, courseRole, possibleAlias))) {
      return;
    }

    const courseChannel = await sendWelcomeMessage(i, dbCourse, courseRole);

    await i.reply(`${courseChannel} added!`);
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
