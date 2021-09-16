import { ButtonInteraction } from "discord.js";

export type ButtonAction = {
  customId: string;
  execute: (interaction: ButtonInteraction) => void;
};
