import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "../../command.interface";

import { deleteCourse } from "./delete.service";

export class DeleteCourseCommand implements ICommand {
  name = "delete";
  description = "Delete a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { id: "796214872479498241", type: "ROLE", permission: true },
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
