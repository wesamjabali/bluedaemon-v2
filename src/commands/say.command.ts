import { CommandOption, ICommand } from "./command.interface";
import {
  ApplicationCommandPermissionData,
  CommandInteraction,
} from "discord.js";

export class SayCommand implements ICommand {
  name = "say";
  description = "Have me repeat what you say";
  default_permission = false;
  permissions: ApplicationCommandPermissionData[] = [{ type: "ROLE", id: "883426092927569930", permission: true }];

  options: CommandOption[] = [
    {
      type: "String",
      name: "repeat",
      description: "The message you'd like me to repeat",
      required: true,
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(
      `${interaction.options.getString("repeat", true)}`
    );
  }
}
