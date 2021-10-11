import { ButtonAction } from "./button-action";

export const buttons: ButtonAction[] = [
  { customId: "list-back", execute: () => {} },
  { customId: "list-forward", execute: () => {} },
];

export function registerButtons(args: ButtonAction[]): void {
  for (const button of args) {
    if (!buttons.find((b) => b.customId === button.customId)) {
      buttons.push(button);
    }
  }
}
