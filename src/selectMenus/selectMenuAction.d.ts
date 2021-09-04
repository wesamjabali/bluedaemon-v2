import { SelectMenuInteraction } from "discord.js";

export type SelectMenuAction = {
  customId: string;
  execute: (interaction: SelectMenuInteraction) => void;
};
