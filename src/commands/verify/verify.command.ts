import { CommandInteraction, GuildMember } from "discord.js";
import { CommandOption, ICommand } from "@/commands/command.interface";
import axios from "axios";
import { logger } from "@/main";
import { getGuildConfig } from "@/config/guilds.config";

export class VerifyCommand implements ICommand {
  name = "verify";
  description = "Verify school email";
  default_permission = true;

  options: CommandOption[] = [
    {
      type: "String",
      name: "email-or-code",
      description: "Email or Code",
      required: true,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const emailOrCode = i.options.getString("email-or-code", true);
    if (emailOrCode.match(/^\S+@\S+\.\S+$/)) {
      try {
        await axios.post(`${process.env.API_BASE_URL}/verify/create`, {
          userId: i.user.id,
          email: emailOrCode,
        });
        i.reply({
          content: `We've sent you an email to ${emailOrCode}. Get the code and run \`/verify\` with the code.`,
          ephemeral: true,
        });
        logger.log(
          "INFO",
          i.guild,
          `Verification email sent to ${emailOrCode} for user ${i.user}`
        );
      } catch (err: any) {
        const {
          response: {
            data: { message },
          },
        } = err;

        i.reply({ content: `ERROR: ${message}`, ephemeral: true });
        logger.log(
          "INFO",
          i.guild,
          `Verification failed to send to ${emailOrCode} for user ${i.user} with error \`\`\`${message}\`\`\``
        );
      }
    } else if (emailOrCode.match(/\b\d{6}\b/)) {
      try {
        const { data: message } = await axios.post(
          `${process.env.API_BASE_URL}/verify`,
          {
            userId: i.user.id,
            code: emailOrCode,
          }
        );

        if ((message as string).includes("faculty")) {
          await (i.member as GuildMember).roles.add(
            getGuildConfig(i.guildId)?.facultyRoleId as string
          );

          i.reply({
            content: `You've been verified as faculty!`,
          });
          logger.log("INFO", i.guild, `${i.user} verified as faculty`);
        } else {
          await (i.member as GuildMember).roles.add(
            getGuildConfig(i.guildId)?.verifiedRoleId as string
          );
          i.reply({
            content: `You've been verified!`,
          });
          logger.log("INFO", i.guild, `${i.user} verified as student`);
        }
      } catch (err: any) {
        const {
          response: {
            data: { message },
          },
        } = err;

        i.reply({ content: `ERROR: ${message}`, ephemeral: true });
        logger.log(
          "INFO",
          i.guild,
          `${i.user} failed to verify with error: \`\`\`${message}\`\`\``
        );
      }
    } else {
      i.reply({ content: "Please enter a valid option.", ephemeral: true });
      logger.log(
        "INFO",
        i.guild,
        `${i.user} passed a bad option to /verify: \`\`\`${emailOrCode}\`\`\``
      );
    }
  }
}
