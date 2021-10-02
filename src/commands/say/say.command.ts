import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { CommandInteraction } from "discord.js";

export class SayCommand implements ICommand {
  name = "say";
  description = "Have me repeat what you say";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
    { type: "Moderator", permission: true },
    { type: "GuildOwner", permission: true },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "repeat",
      description: "The message you'd like me to repeat",
      required: true,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    await i.channel?.send({ content: `${i.options.getString("repeat", true)}` });
    i.reply({ content: "Done!", ephemeral: true });
  }
}
