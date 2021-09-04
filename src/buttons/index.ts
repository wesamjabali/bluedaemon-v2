import { ButtonAction } from "./ButtonAction.service";

export const buttons: ButtonAction[] = [];

export function registerButtons(args: ButtonAction[]): void {
  for (const button of args) {
    if (!buttons.find((b) => b.customId === button.customId)) {
      buttons.push(button);
    }
  }
}
