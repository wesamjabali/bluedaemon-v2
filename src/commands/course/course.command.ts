import { getGuildConfig } from "../../config/guilds.config";
import { CommandInteraction } from "discord.js";
import { CommandOption, ICommand } from "../command.interface";
import { CreateCourseCommand } from "./create/create.command";
import { JoinCourseCommand } from "./join/join.command";

export class CourseCommand implements ICommand {
  name = "course";
  description = "All commands pertaining to courses.";
  default_permission = true;

  options: CommandOption[] = [
    {
      type: "Subcommand",
      subCommands: [new CreateCourseCommand(), new JoinCourseCommand()],
    },
  ];

  async execute(interaction: CommandInteraction) {
    const guildConfig = getGuildConfig(interaction.guildId);
    if(!guildConfig) return;
    
    if (
      !guildConfig.courseManagerRoleId ||
      !guildConfig.courseRequestsChannelId ||
      !guildConfig.moderatorRoleId ||
      !guildConfig.currentQuarterName ||
      !guildConfig.loggingChannelId
    ) {
      interaction.reply("Setup your server with `/sudo setup`");
      return;
    }

    const route = `course/${interaction.options.getSubcommand()}`;

    if (route === "course/create") {
      new CreateCourseCommand().execute(interaction);
    }

    if (route === "course/join") {
      new JoinCourseCommand().execute(interaction);
    }
  }
}