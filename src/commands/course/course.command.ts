import { CommandInteraction } from "discord.js";
import { CommandOption, ICommand } from "../command.interface";
import { CreateCourseCommand } from "./create/create.command";

export class CourseCommand implements ICommand {
  name = "course";
  description = "All commands pertaining to courses.";
  default_permission = true;

  options: CommandOption[] = [
    { type: "Subcommand", subCommands: [new CreateCourseCommand()] },
  ];

  async execute(interaction: CommandInteraction) {
    const route = `course/${interaction.options.getSubcommand()}`;

    if (route === "course/create") {
      new CreateCourseCommand().execute(interaction);
    }
  }
}
