import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { createCommandOptions } from "./create.options";
import { createCourse } from "./create.service";

export class CreateCourseCommand implements ICommand {
  name = "create";
  description = "Create a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { id: "796214872479498241", type: "ROLE", permission: true },
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

    i.reply(
      await createCourse(
        i.guild,
        courseCode,
        courseDescription,
        quarter,
        courseCategoryOption,
        courseOwner,
        password,
        linkedNameOption
      )
    );
  }
}
