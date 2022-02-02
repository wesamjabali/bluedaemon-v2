import { CommandInteraction } from "discord.js";
import { CommandOption, ICommand } from "@/commands/command.interface";
import axios from "axios";
import { logger } from "@/main";

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
        i.reply({ content: `ERROR: ${err.message}`, ephemeral: true });
        logger.log(
          "INFO",
          i.guild,
          `Verification failed to send to ${emailOrCode} for user ${i.user} with error \`\`\`${err.message}\`\`\``
        );
      }
    } else if (emailOrCode.match(/\b\d{6}\b/)) {
      try {
        await axios.post(`${process.env.API_BASE_URL}/verify`, {
          userId: i.user.id,
          code: emailOrCode,
        });
        i.reply({
          content: `You've been verified!`,
        });
        logger.log("INFO", i.guild, `${i.user} verified`);
      } catch (err: any) {
        i.reply({ content: `ERROR: ${err.message}`, ephemeral: true });
        logger.log(
          "INFO",
          i.guild,
          `${i.user} failed to verify with error: \`\`\`${err.message}\`\`\``
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
