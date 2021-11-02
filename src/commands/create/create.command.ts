import { CommandInteraction, Message } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { createCommandOptions } from "./create.options";
import { createCourse } from "./create.service";
import { logger } from "@/main";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";

export class CreateCourseCommand implements ICommand {
  name = "course-create";
  description = "Create a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = createCommandOptions;

  async execute(i: CommandInteraction) {
    const courseDescription = i.options.getString("description", false);
    const courseCode = i.options.getString("code", true);
    const quarter = i.options.getString("quarter", false);
    const linkedNameOption = i.options.getString("linked_name");
    const password = i.options.getString("password", false);
    const courseCategoryOption = i.options.getBoolean("category", false);
    const courseOwner = i.options.getUser("owner", false);

    const replyText = await createCourse(
      i.guild,
      courseCode,
      courseDescription,
      quarter,
      courseCategoryOption,
      courseOwner,
      password,
      linkedNameOption
    );

    const replyMessage = await i.reply({
      content: replyText,
      fetchReply: true,
    });

    if (replyText.includes("created!")) {
      logger.logToChannel(
        i.guild,
        `Course created:
\`Name: ${normalizeCourseCode(courseCode).courseName}\`
\`Created by: ${i.user}\`
\`${password ? "Password: " + password : ""}\`
\`Context:\` ${(replyMessage as Message).url}`
      );
    }
  }
}
