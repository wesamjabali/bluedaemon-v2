import { prisma } from "../../../prisma/prisma.service";
import { normalizeCourseCode } from "../../../helpers/normalizeCourseCode.helper";
import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "../../command.interface";
import { createCourse } from "../create/create.service";

export class BulkCreateCourseCommand implements ICommand {
  name = "bulkcreate";
  description = "Create a set of courses";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { id: "796214872479498241", type: "ROLE", permission: true },
  ];

  options: CommandOption[] = [
    { type: "String", name: "quarter", required: true },
    {
      type: "String",
      name: "courses",
      required: true,
      description: 'Courses separated by a space. i.e: "CSC300 ANI230-401"',
    },
  ];

  async execute(i: CommandInteraction) {
    i.deferReply();
    const quarter = i.options.getString("quarter", true);
    const courseCodes = i.options.getString("courses", true);
    const courseDescription = null;
    const linkedNameOption = null;
    const password = null;
    const courseCategoryOption = false;
    const courseOwner = null;

    let coursesArray = courseCodes.split(" ");
    let normalizedCourses: string[] = [];

    const dbQuarter = await prisma.quarter.findFirst({
      where: { name: quarter, guild: { guildId: i.guild?.id } },
    });

    if (!dbQuarter) {
      i.reply(`"${quarter}"" not a valid quarter`);
      return;
    }

    coursesArray.forEach((c) => {
      const normalizedName = normalizeCourseCode(c);
      if (!normalizedName.courseCodeNumber || normalizedName.courseCodePrefix) {
        normalizedCourses.push(normalizedName.courseName);
      }
    });

    let response = `Done!\n`;
    for (const courseCode of normalizedCourses) {
      const newResponse = await createCourse(
        i.guild,
        courseCode,
        courseDescription,
        quarter,
        courseCategoryOption,
        courseOwner,
        password,
        linkedNameOption
      );

      response = `${response}${courseCode}: ${newResponse}\n`;
    }

    await i.followUp(`\`\`\`${response}\`\`\``);
  }
}
