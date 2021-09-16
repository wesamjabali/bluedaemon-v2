import { prisma } from "@/prisma/prisma.service";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { Guild } from "discord.js";
import { getGuildConfig } from "@/config/guilds.config";

export async function setCoursePassword(
  guild: Guild,
  courseCode: string,
  quarterId: number,
  password: string | null
): Promise<string> {
  const guildConfig = getGuildConfig(guild.id);
  if (!guildConfig?.currentQuarterId || !guild.id) {
    return "Cache failed to load.";
  }

  const { courseName } = normalizeCourseCode(courseCode);
  const dbCourse = await prisma.course.findFirst({
    where: {
      AND: {
        guildId: guild.id,
        quarter: { id: quarterId },
        aliases: { has: courseName },
      },
    },
  });

  if (!dbCourse) return `${courseName} not found.`;

  await prisma.course.update({
    where: { id: dbCourse.id },
    data: { password: password ?? null },
  });

  return `Password updated for ${courseName}`;
}
