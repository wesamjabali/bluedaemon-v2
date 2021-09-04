import { SelectMenuAction } from "./selectMenuAction";

export const selectMenus: SelectMenuAction[] = [];

export function registerSelectMenus(newSelectMenus: SelectMenuAction[]): void {
  for (const newSelectMenu of newSelectMenus) {
    if (!selectMenus.find((sm) => sm.customId === newSelectMenu.customId)) {
      selectMenus.push(newSelectMenu);
    }
  }
}
