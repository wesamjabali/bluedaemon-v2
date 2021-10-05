import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { displayList } from "@/services/display-list.service";
import { CommandInteraction, TextChannel } from "discord.js";

export class ListCourseMembersCommand implements ICommand {
  name = "list-course-members";
  description = "Search course members, or display all";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search term for course members",
      required: false,
    },
  ];

  buttonActions = [
    { customId: "role-list-back", execute: () => {} },
    { customId: "role-list-forward", execute: () => {} },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const guildConfig = getGuildConfig(i.guildId as string);
    const searchTerm = i.options.getString("search", false)?.toUpperCase();
    let course = guildConfig?.courses.find((c) => c.channelId === i.channelId);

    if (!course) {
      course = guildConfig?.courses.find(
        (c) => c.channelId === (i.channel as TextChannel).parentId
      );
    }

    if (!course)
      return i.reply("This command only works inside course channels.");

    await i.guild?.members.fetch();

    const courseRole = i.guild?.roles.cache.find(
      (r) => r.id === course?.roleId
    );

    const allMembers = Array.from(
      courseRole?.members.map((g) => g.nickname ?? g.user.username) || []
    );

    await i.deferReply();
    displayList(
      i,
      allMembers,
      `${course.aliases[0]} members (${courseRole?.members.size})`,
      searchTerm
    );
  }
}
