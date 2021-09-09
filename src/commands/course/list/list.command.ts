import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { prisma } from "@/prisma/prisma.service";
import { Embed } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { join } from "path/posix";

export class ListCoursesCommand implements ICommand {
  name = "list";
  description = "Search courses, or display all";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "Everyone", permission: true },
  ];

  buttonActions = [
    { customId: "list-back", execute: () => {} },
    { customId: "list-forward", execute: () => {} },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search term for courses",
      required: false,
    },
  ];

  public async execute(interaction: CommandInteraction): Promise<void> {
    interaction.deferReply();
    let pageNumber = 0;
    const guildConfig = getGuildConfig(interaction.guildId as string);
    const searchTerm = interaction.options
      .getString("search", false)
      ?.toUpperCase();

    let courses = await prisma.course.findMany({
      where: {
        AND: {
          guild: { guildId: interaction.guildId as string },
          quarter: { id: guildConfig?.currentQuarterId as number },
          password: { equals: null },
        },
      },
    });
    let filteredCourses: string[] = [];
    for (const c of courses) {
      filteredCourses.push(
        ...c.aliases.filter((a) => a.includes(searchTerm ?? ""))
      );
    }

    const buttons = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId("list-back")
          .setStyle("PRIMARY")
          .setEmoji("⬅️"),
        new MessageButton()
          .setCustomId("list-forward")
          .setStyle("PRIMARY")
          .setEmoji("➡️"),
      ]),
    ];

    const sentReplyMessage = (await interaction.followUp({
      embeds: getCourseListEmbedPage(filteredCourses, pageNumber, searchTerm),
      components: buttons,
    })) as Message;

    const collector = sentReplyMessage.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 15000,
    });

    collector.on("collect", async (b) => {
      if (b.user.id !== interaction.user.id) {
        await b.reply({
          content: "You're not allowed to do that. Make your own search.",
          ephemeral: true,
        });
      }

      if (b.customId === "list-back") {
        interaction.editReply({
          embeds: getCourseListEmbedPage(
            filteredCourses,
            --pageNumber,
            searchTerm
          ),
        });
      }
      if (b.customId === "list-forward") {
        interaction.editReply({
          embeds: getCourseListEmbedPage(
            filteredCourses,
            ++pageNumber,
            searchTerm
          ),
        });
      }

      await b.reply(" ");
      await b.deleteReply();
    });
  }
}

function getCourseListEmbedPage(
  courseList: string[],
  pageNumber: number,
  searchTerm?: string
): MessageEmbed[] {
  let filteredCourses = courseList.slice(24 * pageNumber, 24);
  if (filteredCourses.length === 0) {
    filteredCourses = courseList.slice(
      24 * pageNumber,
      24 - (courseList.length % pageNumber) * 24
    );
  }

  let currentEmbed = new MessageEmbed();
  currentEmbed
    .setTitle("Courses " + (searchTerm ? `with \`${searchTerm}\`` : ""))
    .setColor("BLUE")
    .setDescription("For the current quarter.");
  for (const c of filteredCourses) {
    currentEmbed.addField(`\`${c}\``, "​", true);
  }

  return [currentEmbed];
}
