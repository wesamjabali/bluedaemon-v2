import { SelectMenuInteraction } from "discord.js";

export class SelectMenuAction {
  constructor(
    customId: string,
    execute: (interaction: SelectMenuInteraction) => void
  ) {
    this.customId = customId;
    this.execute = execute;
  }

  customId: string;
  execute: (interaction: SelectMenuInteraction) => void;
}
