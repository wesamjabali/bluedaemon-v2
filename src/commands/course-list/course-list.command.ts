import { Course } from ".prisma/client";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { displayList } from "@/services/display-list.service";
import { CommandInteraction } from "discord.js";

export class ListCoursesCommand implements ICommand {
  name = "course-list";
  description = "Search courses, or display all";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search term for courses",
      required: false,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    i.deferReply();
    const guildConfig = getGuildConfig(i.guildId as string);
    const searchTerm = i.options.getString("search", false)?.toUpperCase();

    let courses =
      (
        guildConfig?.courses.filter(
          (c) => c.quarterId === guildConfig.currentQuarterId && !c.password
        ) as Course[]
      ).sort((a, b) => (a.aliases[0] < b.aliases[0] ? -1 : 1)) ||
      ([] as Course[]);

    let filteredCourses: string[] = [];
    for (const c of courses) {
      filteredCourses.push(
        ...c.aliases.filter((a) => a.includes(searchTerm ?? ""))
      );
    }

    displayList(i, filteredCourses, "Courses", searchTerm);
  }
}
