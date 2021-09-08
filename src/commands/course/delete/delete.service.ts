import { prisma } from "@/prisma/prisma.service";
import { CategoryChannel } from "discord.js";
import { normalizeCourseCode } from "@/helpers/normalizeCourseCode.helper";
import { getGuildConfig } from "@/config/guilds.config";
import { client } from "@/main";
import { Quarter } from ".prisma/client";

export async function deleteCourse(
  possibleAlias: string,
  guildId: string,
  quarter: string | null
) {
  const guild = client.guilds.cache.find((g) => g.id === guildId);
  const guildConfig = getGuildConfig(guildId);
  if (!guildConfig?.currentQuarterId || !guild) return "Guild not configured.";

  possibleAlias = normalizeCourseCode(possibleAlias).courseName;
  let dbQuarter;

  //   console.log(quarter);
  let builtReply = "";
  if (quarter) {
    dbQuarter = (await prisma.quarter.findFirst({
      where: { AND: { name: quarter, guild: { guildId: guildId } } },
    })) as Quarter;
    console.log(dbQuarter?.name);
  } else {
    dbQuarter = (await prisma.quarter.findFirst({
      where: { id: guildConfig.currentQuarterId },
    })) as Quarter;
  }
  if (!dbQuarter) {
    return `${quarter} is not a valid quarter.`;
  }

  let dbCourse = await prisma.course.findFirst({
    where: {
      aliases: { has: possibleAlias },
      guildId: guildId,
      quarterId: dbQuarter?.id,
    },
  });

  if (!dbCourse) {
    return `${possibleAlias} is not a valid course.`;
  }

  const courseRole = guild.roles.cache.find((r) => r.id === dbCourse?.roleId);
  const courseChannel = guild.channels.cache.find(
    (c) => c.id === dbCourse?.channelId
  );

  if (!courseRole) {
    builtReply += "`Course role not found. Was it deleted?`\n";
  }

  if (!courseChannel) {
    builtReply += "`Course channel not found. Was it deleted?`\n";
  }

  if (dbCourse.category) {
    (courseChannel as CategoryChannel).children.forEach(
      async (c) => await c.delete()
    );
  }

  await courseChannel?.delete();
  await courseRole?.delete();
  await prisma.course.delete({ where: { roleId: dbCourse?.roleId } });

  return `\`${dbCourse.aliases.join("/")}\` deleted!\n${builtReply}`;
}
