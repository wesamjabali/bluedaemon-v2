import { CommandInteraction, TextChannel } from "discord.js";
import {
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";

export class InviteCommand implements ICommand {
  name = "invite";
  description = "Generate an invite for this server";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const guildConfig = getGuildConfig(i.guildId);
    const introductionsChannel = i.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.introductionsChannelId
    ) as TextChannel | undefined;
    let invite;
    if (introductionsChannel) {
      invite = await introductionsChannel?.createInvite({
        unique: true,
        maxAge: 0,
      });
    } else {
      invite = (
        i.guild?.channels.cache.find(
          (c) => c.type === "GUILD_TEXT"
        ) as TextChannel
      ).createInvite({
        unique: true,
        maxAge: 0,
      });
    }

    await i.reply({
      content: `Here's your invite: ${invite}`,
    });
  }
}
