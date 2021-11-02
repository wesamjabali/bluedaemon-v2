import { CommandInteraction, TextChannel, Message } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { dispatchQotd } from "@/services/dispatchQotd.service";
import { getGuildConfig } from "@/config/guilds.config";

export class DispatchQotdCommand implements ICommand {
  name = "dispatch";
  description = "Immediately dispatch a QOTD";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];
  options: CommandOption[] = [
    { type: "Integer", name: "qotd_id", required: false },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const guildConfig = getGuildConfig(i.guildId);
    const qotdId = i.options.getInteger("qotd_id", false);
    if (qotdId && !guildConfig?.qotds.find((q) => q.id === qotdId)) {
      return i.reply({
        content: `QOTD with ID ${qotdId} doesn't exist.`,
        ephemeral: true,
      });
    }

    if (guildConfig?.qotds.filter((q) => !q.used).length === 0) {
      return i.reply({
        content: `There are no unused QOTDs.`,
        ephemeral: true,
      });
    }

    dispatchQotd(i.guildId, qotdId);

    await i.reply({
      content: `QOTD dispatched.`,
      ephemeral: true,
    });
  }
}
