import { prisma } from "../../../prisma/prisma.service";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { CommandOption, ICommand } from "../../command.interface";

import { getRoleFromCourseName } from "../../../helpers/getRoleFromCourseName.helper";
import { getGuildConfig } from "../../../config/guilds.config";
import { normalizeCourseCode } from "../../../helpers/normalizeCourseCode.helper";
import { Quarter } from ".prisma/client";

export class LeaveCourseCommand implements ICommand {
  name = "leave";
  description = "Leave a course";
  default_permission = true;

  options: CommandOption[] = [
    { type: "String", name: "course", required: true },
    {
      type: "String",
      name: "quarter",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    if (!guildConfig || !i.guildId) return;
    const quarter = i.options.getString("quarter");

    const dbQuarter = quarter
      ? ((await prisma.quarter.findFirst({
          where: { AND: { name: quarter, Guild: { guildId: i.guildId } } },
        })) as Quarter)
      : ((await prisma.quarter.findFirst({
          where: {
            AND: {
              id: guildConfig.currentQuarterId as number,
              Guild: { guildId: i.guildId },
            },
          },
        })) as Quarter);

    if (!i.guildId) return;

    if (!dbQuarter) {
      await i.reply(`${quarter} is not a valid quarter.`);
      return;
    }
    const courseName = normalizeCourseCode(i.options.getString("course", true));
    const courseRole = await getRoleFromCourseName(
      courseName.courseName,
      dbQuarter,
      i.guildId
    );
    if (!courseRole) return i.reply("courseRole not found");

    if (
      !(i.member?.roles as GuildMemberRoleManager).cache.find(
        (r) => r.id === courseRole.id
      )
    ) {
      i.reply(`You're not in ${courseName.courseName} for quarter ${dbQuarter.name}`);
      return;
    }

    await (i.member?.roles as GuildMemberRoleManager).remove(courseRole);
    await i.reply(`You've left ${courseName.courseName} for quarter ${dbQuarter.name}`);
  }
}
