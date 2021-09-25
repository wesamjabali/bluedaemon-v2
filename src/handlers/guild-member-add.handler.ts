import { getGuildConfig } from "@/config/guilds.config";
import { logger } from "@/main";
import { ClientEvents, Guild, GuildMember } from "discord.js";
import { IEventHandler } from "./event-handler.interface";

export class GuildMemberAddHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "guildMemberAdd";
  public onEvent = async (member: GuildMember) => {
    const guildConfig = getGuildConfig(member.guild.id);

    if (guildConfig?.welcomeMessage) {
      await member.send(guildConfig.welcomeMessage);
    }

    if (guildConfig?.communityPingRoleId) {
      await member.roles.add(guildConfig.communityPingRoleId).catch(() => {
        logger.logToChannel(
          member.guild as Guild,
          `<@${member.guild?.ownerId}>: ${member.user} didn't get the welcome role after joining because the BlueDaemon role isn't high enough. Make sure you make my role the highest in the server.
        https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101`
        );
      });
    }
  };
}
