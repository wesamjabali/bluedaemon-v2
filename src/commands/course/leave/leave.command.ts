import { prisma } from "../../../prisma/prisma.service";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { CommandOption, ICommand } from "../../command.interface";

import { getRoleFromCourseName } from "../../../helpers/getRoleFromCourseName.helper";
import { getGuildConfig } from "../../../config/guilds.config";
import { normalizeCourseCode } from "../../../helpers/normalizeCourseCode.helper";

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
    const quarter =
      i.options.getString("quarter") ??
      getGuildConfig(i.guildId)?.currentQuarterName;

    if (!quarter || !i.guildId) return;

    const validQuarter = !!(await prisma.quarter.findFirst({
      where: { name: quarter, Guild: { every: { guildId: i.guildId } } },
    }));

    if (!validQuarter) {
      await i.reply(`${quarter} is not a valid quarter.`);
      return;
    }
    const courseName = normalizeCourseCode(i.options.getString("course", true));
    const courseRole = await getRoleFromCourseName(
      courseName.courseName,
      quarter,
      i.guildId
    ).catch((e) => {
      i.reply(e);
      return;
    });
    if (!courseRole) return;

    if (
      !(i.member?.roles as GuildMemberRoleManager).cache.find(
        (r) => r.id === courseRole.id
      )
    ) {
      i.reply(`You're not in ${courseName.courseName} for quarter ${quarter}`);
      return;
    }

    await (i.member?.roles as GuildMemberRoleManager).remove(courseRole);
    await i.reply(`You've left ${courseName} for quarter ${quarter}`);
  }
}
