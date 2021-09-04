import { ButtonInteraction } from "discord.js";

export class ButtonAction {
  constructor(
    customId: string,
    execute: (interaction: ButtonInteraction) => void
  ) {
    this.customId = customId;
    this.execute = execute;
  }

  customId: string;
  execute: (interaction: ButtonInteraction) => void;
}
