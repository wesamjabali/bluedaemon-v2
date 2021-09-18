import { CommandInteraction } from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { normalizeTagName } from "../create-tag/create-tag.service";

export class TagCommand implements ICommand {
  name = "tag";
  description = "Get the content of a tag.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];
  options: CommandOption[] = [
    {
      type: "String",
      name: "tag",
      description: "Name of the tag.",
      required: true,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    const guildConfig = getGuildConfig(i.guildId);
    const tagName = normalizeTagName(i.options.getString("tag", true));

    const tag = guildConfig?.tags.find((t) => t.name === tagName);

    if (!tag) {
      await i.reply(
        `Tag \`${tagName}\` doesn't exist! Use \`/list-tags\` to view the available tags.`
      );
      return;
    }

    await i.reply({
      content: `\`${tagName}\`:\n\n${tag.tagText}`,
    });
  }
}
