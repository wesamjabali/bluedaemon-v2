import { prisma } from "@/prisma/prisma.service";
import { CategoryChannel } from "discord.js";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { getGuildConfig } from "@/config/guilds.config";
import { client } from "@/main";
import { Quarter } from ".prisma/client";
import { resetCacheForGuild } from "@/helpers/reset-cache-for-guild.helper";

export async function deleteCourse(
  possibleAlias: string,
  guildId: string,
  quarter: string | null
) {
  const guild = client.guilds.cache.find((g) => g.id === guildId);
  const guildConfig = getGuildConfig(guildId);
  if (!guildConfig?.currentQuarterId || !guild) return "Guild not configured.";

  possibleAlias = normalizeCourseCode(possibleAlias).courseName;
  let dbQuarter: Quarter | null | undefined;

  let builtReply = "";
  if (quarter) {
    dbQuarter = guildConfig.quarters.find((q) => q.name === quarter);
  } else {
    dbQuarter = guildConfig.currentQuarter;
  }
  if (!dbQuarter) {
    return `\`${quarter}\` is not a valid quarter.`;
  }

  let dbCourse = guildConfig.courses.find(
    (c) => c.quarterId === dbQuarter?.id && c.aliases.includes(possibleAlias)
  );

  if (!dbCourse) {
    return `\`${possibleAlias}\` is not a valid course.`;
  }

  const courseRole = guild.roles.cache.find((r) => r.id === dbCourse?.roleId);
  const courseChannel = guild.channels.cache.find(
    (c) => c.id === dbCourse?.channelId
  );

  if (!courseRole) {
    builtReply += `Role for \`${possibleAlias}\` not found. Was it deleted?\n`;
  }

  if (!courseChannel) {
    builtReply += `Channel for \`${possibleAlias}\` not found. Was it deleted?\n`;
  }

  if (dbCourse.category) {
    for (const c of (courseChannel as CategoryChannel).children.values())
      await c.delete();
  }

  await courseChannel?.delete();
  await courseRole?.delete();
  await prisma.course.delete({ where: { roleId: dbCourse?.roleId } });
  await resetCacheForGuild(guild.id, "courses");

  return `\`${dbCourse.aliases.join("/")}\` deleted!\n${builtReply}`;
}
