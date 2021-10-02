import { CommandInteraction, Role, User } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { logger } from "@/main";

export class EditMessageCommand implements ICommand {
  name = "edit-message";
  description = "Edit a message sent by the bot.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "message_id",
      required: true,
      description: "ID of message to edit.",
    },
    {
      type: "String",
      name: "message",
      required: true,
      description: "New message content",
    },
  ];

  async execute(i: CommandInteraction) {
    const messageId = i.options.getString("message_id", true);
    const message = i.options.getString("message", true);

    let errorFlag = false;
    const apiMessage = await i.channel?.messages.fetch(messageId).catch(() => {
      i.reply("I don't have permission to edit that message.");
      errorFlag = true;
    });
    if (errorFlag) return;

    if (!apiMessage) {
      return i.reply({
        content:
          "Message not found. Make sure you run this command in the same channel as the message you want to edit.",
        ephemeral: true,
      });
    }

    logger.logToChannel(
      i.guild,
      `Bot message edited by ${i.user}.\n\n\`Before:\`\n${apiMessage.content}\n\n\`After:\`\n${message}`
    );
    apiMessage?.edit(message);
    i.reply({ content: "Message edited.", ephemeral: true });
  }
}
