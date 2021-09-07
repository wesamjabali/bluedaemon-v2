import { getGuildConfig } from "../../config/guilds.config";
import { CommandInteraction } from "discord.js";
import { CommandOption, ICommand } from "../command.interface";
import { CreateCourseCommand } from "./create/create.command";
import { JoinCourseCommand } from "./join/join.command";
import { LeaveCourseCommand } from "./leave/leave.command";
import { DeleteCourseCommand } from "./delete/delete.command";
import { BulkCreateCourseCommand } from "./bulkCreate/bulkCreate.command";

export class CourseCommand implements ICommand {
  name = "course";
  description = "All commands pertaining to courses.";
  default_permission = true;

  options: CommandOption[] = [
    {
      type: "Subcommand",
      subCommands: [
        new CreateCourseCommand(),
        new JoinCourseCommand(),
        new LeaveCourseCommand(),
        new DeleteCourseCommand(),
        new BulkCreateCourseCommand(),
      ],
    },
  ];

  async execute(interaction: CommandInteraction) {
    const guildConfig = getGuildConfig(interaction.guildId);

    if (
      !guildConfig ||
      !guildConfig.courseManagerRoleId ||
      !guildConfig.courseRequestsChannelId ||
      !guildConfig.moderatorRoleId ||
      !guildConfig.currentQuarterId ||
      !guildConfig.loggingChannelId
    ) {
      interaction.reply("Setup your server with `/sudo meta setup`");
      return;
    }

    const route = `course/${interaction.options.getSubcommand()}`;

    if (route === "course/create") {
      new CreateCourseCommand().execute(interaction);
    }

    if (route === "course/delete") {
      new DeleteCourseCommand().execute(interaction);
    }

    if (route === "course/join") {
      new JoinCourseCommand().execute(interaction);
    }

    if (route === "course/leave") {
      new LeaveCourseCommand().execute(interaction);
    }

    if (route === "course/bulkcreate") {
      new BulkCreateCourseCommand().execute(interaction);
    }
  }
}
