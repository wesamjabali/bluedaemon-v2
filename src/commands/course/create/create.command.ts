import { prisma } from "../../../prisma/prisma.service";
import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "../../command.interface";

export class CreateCourseCommand implements ICommand {
  name = "create";
  description = "Create a course";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { id: "796214872479498241", type: "ROLE", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "description",
      description: '"Intro to Programming I"',
      required: true,
    },
    {
      type: "String",
      name: "prefix",
      description: "((CSC))-300-401",
      required: true,
    },
    {
      type: "String",
      name: "number",
      description: "CSC-((300))-401",
      required: true,
    },
    {
      type: "String",
      name: "section",
      description: "CSC-300-((401))",
      required: false,
    },
    {
      type: "String",
      name: "quarter",
      description: "Create this course in another quarter.",
      required: false,
    },
  ];

  async execute(i: CommandInteraction) {
    const courseDescription = i.options.getString("description", true);
    const courseCodePrefix = i.options.getString("prefix", true);
    const courseCodeNumber = i.options.getString("number", true);
    const courseCodeSection = i.options.getString("section", false);
    const quarter = i.options.getString("quarter", false);

    

    await prisma.course.create({
      data: {
        courseCodePrefix: courseCodePrefix,
        courseCodeNumber: courseCodeNumber,
        courseCodeSection: courseCodeSection,
        channelId: "123",
        description: courseDescription,
        quarterCategoryChannelIds: [quarter || ""],
        roleId: "sdaf",
        guild: { connect: { guildId: i.guildId as string } },
      },
    });
    await i.reply("Created!");
  }
}
