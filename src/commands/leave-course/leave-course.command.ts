import { prisma } from "@/prisma/prisma.service";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { getRoleFromCourseName } from "@/helpers/get-role-from-course-name.helper";
import { getGuildConfig } from "@/config/guilds.config";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { Quarter } from ".prisma/client";

export class LeaveCourseCommand implements ICommand {
  name = "leave-course";
  description = "Leave a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

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
    if (!guildConfig.currentQuarterId) return;

    const dbQuarter = quarter
      ? guildConfig.quarters.find((q) => q.name === quarter)
      : guildConfig.currentQuarter;

    if (!i.guildId) return;

    if (!dbQuarter) {
      await i.reply(
        `${quarter} is not a valid quarter. Available quarters are: \`\`\`${guildConfig.quarters
          .flatMap((c) => c.name)
          .join(", ")}\`\`\``
      );
      return;
    }
    const courseName = normalizeCourseCode(i.options.getString("course", true));
    const courseRoleId = guildConfig.courses.find(
      (c) =>
        c.aliases.includes(courseName.courseName) &&
        c.quarterId === dbQuarter.id
    )?.roleId;
    const courseRole = i.guild?.roles.cache.find((r) => r.id === courseRoleId);

    if (!courseRole) return i.reply("courseRole not found");

    if (
      !(i.member?.roles as GuildMemberRoleManager).cache.find(
        (r) => r.id === (courseRole.id as string)
      )
    ) {
      i.reply(
        `You're not in ${courseName.courseName} for quarter ${dbQuarter.name}`
      );
      return;
    }

    await (i.member?.roles as GuildMemberRoleManager).remove(courseRole);
    await i.reply(
      `You've left ${courseName.courseName} for quarter ${dbQuarter.name}`
    );
  }
}
