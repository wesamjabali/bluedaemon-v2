import { getGuildConfig } from "@/config/guilds.config";
import { ClientEvents, GuildMember } from "discord.js";
import { IEventHandler } from "./eventHandler.interface";

export class GuildMemberAddHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "guildMemberAdd";
  public onEvent = async (member: GuildMember) => {
    const guildConfig = getGuildConfig(member.guild.id);
    if (guildConfig?.welcomeMessage) {
      await member.send(guildConfig.welcomeMessage);
    }
  };
}
