import { RealName } from ".prisma/client";
import { prisma } from "@/prisma/prisma.service";

export let realNames: RealName[] = [];

export const resetCacheForRealNames = async () => {
  realNames = await prisma.realName.findMany();
};

export function getRealName(
  userIdToFind: string | null | undefined
): string | undefined {
  return realNames.find((n) => n.userId === userIdToFind)?.realName;
}
