import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { prisma } from "@/prisma/prisma.service";

export class CreateCourseCommand implements ICommand {
  name = "create-course";
  description = "Create a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [];

  async execute(i: CommandInteraction) {
    const courseDescription = i.options.getString("description", false);
    const courseCode = i.options.getString("code", true);
    const quarter = i.options.getString("quarter", false);
    const linkedNameOption = i.options.getString("linked_name");
    const password = i.options.getString("password", false);
    const courseCategoryOption = i.options.getBoolean("category", false);
    const courseOwner = i.options.getUser("owner", false);

    // prisma.course.update({"where": {""}})
  }
}
