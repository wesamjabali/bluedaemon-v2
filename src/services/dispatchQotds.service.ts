import { guildConfigsCache } from "@/config/guilds.config";
import { dispatchQotd } from "./dispatchQotd.service";

export async function dispatchQotds() {
  for (const guild of guildConfigsCache) {
    dispatchQotd(guild.guildId);
  }
}
