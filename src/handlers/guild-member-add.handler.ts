import { getGuildConfig } from "@/config/guilds.config";
import { logger } from "@/main";
import { ClientEvents, Guild, GuildMember, TextChannel } from "discord.js";
import { IEventHandler } from "./event-handler.interface";

const introMessages = [
  "A huge welcome to you,",
  "Everyone please welcome",
  "Welcome,",
  "We're so happy to have you,",
  "Thanks for joining,",
  "You're gonna love it here,",
  "Glad you made it,",
  "Welcome aboard,",
];

const introPostfixes = [
  "What's your major?",
  "How'd you find this server?",
  "What city are you from?",
  "What's your favorite food?",
  "What's your favorite movie?",
  "What kind of video games do you like?",
  "Please introduce yourself!",
  "We can't wait to meet you!",
  "You can introduce yourself here!",
  ""
];


export class GuildMemberAddHandler implements IEventHandler {
  public once = false;
  public readonly EVENT_NAME: keyof ClientEvents = "guildMemberAdd";
  public onEvent = async (member: GuildMember) => {
    const guildConfig = getGuildConfig(member.guild.id);

    if (guildConfig?.welcomeMessage) {
      await member.send(guildConfig.welcomeMessage);
    }

    if (guildConfig?.introductionsChannelId) {
      const introChannel = member.guild.channels.cache.find(
        (c) => c.id === guildConfig.introductionsChannelId
      ) as TextChannel;
      if (introChannel) {
        const introMessage = await introChannel.send(
          `${
            introMessages[Math.floor(Math.random() * introMessages.length)]
          } ${member.user}! ${
            introPostfixes[
              Math.floor(Math.random() * introPostfixes.length)
            ]
          }`
        );
        introMessage.startThread({
          name: member.nickname ?? member.user.username,
          autoArchiveDuration: "MAX",
        });
      }
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
