import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";

import { deleteCourse } from "./course-delete.service";

export class DeleteCourseCommand implements ICommand {
  name = "course-delete";
  description = "Delete a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];

  options: CommandOption[] = [
    { type: "String", name: "course", required: true },
    { type: "String", name: "quarter", required: false },
  ];

  async execute(i: CommandInteraction) {
    let possibleAlias = i.options.getString("course", true);
    const quarter = i.options.getString("quarter", false);

    await i.reply(
      await deleteCourse(possibleAlias, i.guildId as string, quarter)
    );
  }
}
