import { prisma } from "../prisma/prisma.service";
import { Role } from "discord.js";
import { client } from "../main";
export async function getRoleFromCourseName(
  possibleAlias: string,
  guildId: string
): Promise<Role> {
  const guild = client.guilds.cache.find((g) => g.id === guildId);
  if (!guild) return Promise.reject(`Guild not found.`);

  let dbCourse = await prisma.course.findFirst({
    where: { aliases: { has: possibleAlias } },
  });

  if (!dbCourse) {
    dbCourse = await prisma.course.findFirst({
      where: { aliases: { has: possibleAlias } },
    });
  }

  if (!dbCourse) {
    return Promise.reject(`${possibleAlias} doesn't exist this quarter.`);
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
