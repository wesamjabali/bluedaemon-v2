import { SelectMenuAction } from "./SelectMenu.service";

export const selectMenus: SelectMenuAction[] = [];

export function registerSelectMenus(args: SelectMenuAction[]): void {
  for (const selectMenu of args) {
    if (!selectMenus.find((sm) => sm.customId === selectMenu.customId)) {
      selectMenus.push(selectMenu);
    }
  }
}
