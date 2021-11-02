import { CommandInteraction, Guild } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";
import { setCoursePassword } from "./course-set-password.service";
import { getGuildConfig } from "@/config/guilds.config";
import { Quarter } from ".prisma/client";

export class SetCoursePasswordCommand implements ICommand {
  name = "course-set-password";
  description = "Set or remove a password for a course.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    {
      name: "course",
      required: true,
      type: "String",
      description: "Name of the course you'd like to set password for.",
    },
    {
      name: "password",
      required: false,
      type: "String",
      description:
        "New password for this course. Leave blank to remove the password.",
    },
    {
      name: "quarter",
      required: false,
      type: "String",
      description:
        "Quarter this course is in. Leave blank for current quarter.",
    },
  ];

  async execute(i: CommandInteraction) {
    await i.deferReply();
    const courseCode = i.options.getString("course", true);
    let quarter = i.options.getString("quarter", false);
    const password = i.options.getString("password", false);

    let dbQuarter: Quarter | null;
    if (quarter) {
      dbQuarter = await prisma.quarter.findFirst({
        where: { name: quarter },
      });
      if (!dbQuarter) return i.followUp(`${quarter} is not a valid quarter`);
    } else dbQuarter = null;

    const quarterId =
      dbQuarter?.id ?? (getGuildConfig(i.guildId)?.currentQuarterId as number);

    await i.followUp(
      await setCoursePassword(
        i.guild as Guild,
        courseCode,
        quarterId,
        password ?? null
      )
    );
  }
}
