import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { displayList } from "@/services/display-list.service";

export class ListQotdCommand implements ICommand {
  name = "list";
  description = "List QOTDs with parameters";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];
  options: CommandOption[] = [
    {
      type: "Integer",
      name: "first",
      required: false,
      description: "Select the first x results up to 30. default: 7",
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const guildConfig = getGuildConfig(i.guildId);
    if (!guildConfig) return;
    const numResults = i.options.getInteger("first", false);
    const unusedQotds = guildConfig?.qotds
      .filter((q) => !q.used)
      .slice(0, numResults ?? 7)
      .map((q) => `${q.id}: ${q.question}`);

    if (unusedQotds?.length > 0) {
      displayList(i, unusedQotds, "QOTDs");
    } else {
      i.reply({
        content: `There are no unused QOTDs.`,
        ephemeral: true,
      });
    }
  }
}
