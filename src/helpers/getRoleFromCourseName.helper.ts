import { prisma } from "../prisma/prisma.service";
import { Role } from "discord.js";
import { client } from "../main";
import { normalizeCourseCode } from "./normalizeCourseCode.helper";
export async function getRoleFromCourseName(
  possibleAlias: string,
  quarter: string,
  guildId: string
): Promise<Role> {
  const guild = client.guilds.cache.find((g) => g.id === guildId);
  if (!guild) return Promise.reject(`Guild not found.`);

  possibleAlias = normalizeCourseCode(possibleAlias).courseName;

  let dbCourse = await prisma.course.findFirst({
    where: {
      aliases: { has: possibleAlias },
      guildId: guildId,
      quarterName: quarter,
    },
  });

  if (!dbCourse) {
    dbCourse = await prisma.course.findFirst({
      where: {
        aliases: { has: possibleAlias },
        guildId: guildId,
        quarterName: quarter,
      },
    });
  }

  if (!dbCourse) {
    return Promise.reject(
      `${possibleAlias} doesn't exist for quarter ${quarter}.`
    );
  }

  const courseRole = guild.roles.cache.find(
    (role) => role.id === dbCourse!.roleId
  );

  if (!courseRole) {
    prisma.course.delete({ where: { roleId: dbCourse.roleId } });

    return Promise.reject(
      "That course role no longer exists! I removed it from the database."
    );
  }

  return courseRole;
}
