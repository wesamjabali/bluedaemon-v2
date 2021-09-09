import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { prisma } from "@/prisma/prisma.service";
import { CommandInteraction } from "discord.js";

export class ListCoursesCommand implements ICommand {
  name = "list";
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

  public async execute(interaction: CommandInteraction): Promise<void> {
    const guildConfig = getGuildConfig(interaction.guildId as string);
    const searchTerm = interaction.options
      .getString("search", false)
      ?.toUpperCase();

    let courses = await prisma.course.findMany({
      where: {
        AND: {
          guild: { guildId: interaction.guildId as string },
          quarter: { id: guildConfig?.currentQuarterId as number },
          password: { equals: null },
        },
      },
    });
    let filteredCourses: string[] = [];
    for (const c of courses) {
      filteredCourses.push(
        ...c.aliases.filter((a) => a.includes(searchTerm ?? ""))
      );
    }

    interaction.reply(
      `${
        filteredCourses.join(", ") || "No courses found with that search term."
      }`
    );
  }
}
