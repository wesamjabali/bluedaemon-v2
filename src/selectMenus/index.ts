import { SelectMenuAction } from "./SelectMenu.service";

export const selectMenus: SelectMenuAction[] = [];

export function registerSelectMenu(selectMenu?: SelectMenuAction): void {
  if (selectMenu) {
    if (!selectMenus.find((sm) => sm.customId === selectMenu.customId)) {
      selectMenus.push(selectMenu);
    }
  }
}
