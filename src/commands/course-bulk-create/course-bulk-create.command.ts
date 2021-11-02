import { prisma } from "@/prisma/prisma.service";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { createCourse } from "@/commands/create/create.service";

export class BulkCreateCoursesCommand implements ICommand {
  name = "course-bulk-create";
  description = "Create a set of courses";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
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
    await i.deferReply();
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
      await i.followUp(
        `${quarter} is not a valid quarter. Available quarters are: \`\`\`${(
          await prisma.quarter.findMany({
            where: { guild: { guildId: i.guildId as string } },
            select: { name: true },
          })
        )
          .flatMap((c) => c.name)
          .join(", ")}\`\`\``
      );
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

    await i
      .followUp(`\`\`\`${response}\`\`\``)
      .catch(() => i.followUp("Done!"));
  }
}
