import { Course } from ".prisma/client";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
import { prisma } from "@/prisma/prisma.service";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

export class ListCoursesCommand implements ICommand {
  name = "list-courses";
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

    let courses = guildConfig?.courses.filter(
      (c) => c.quarterId === guildConfig.currentQuarterId && !!c.password
    ) as Course[];
    
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
          .setEmoji("⬅️")
          .setDisabled(true),
        new MessageButton()
          .setCustomId("list-forward")
          .setStyle("PRIMARY")
          .setEmoji("➡️"),
      ]),
    ];
    const initialEmbed = getCourseListEmbedPage(
      filteredCourses,
      pageNumber,
      searchTerm
    );

    if (initialEmbed[0].fields.length !== 24) {
      buttons[0].components[1].setDisabled(true);
    }
    const sentReplyMessage = (await interaction.followUp({
      embeds: initialEmbed,
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
        return;
      }
      await b.reply({ content: "​" });
      await b.deleteReply();
      if (b.customId === "list-back") {
        buttons[0].components[1].setDisabled(false);
        if (pageNumber - 1 === 0) {
          buttons[0].components[0].setDisabled(true);
        }
        interaction.editReply({
          embeds: getCourseListEmbedPage(
            filteredCourses,
            --pageNumber,
            searchTerm
          ),
          components: buttons,
        });
      }
      if (b.customId === "list-forward") {
        const embed = getCourseListEmbedPage(
          filteredCourses,
          ++pageNumber,
          searchTerm
        );
        buttons[0].components[0].setDisabled(false);
        if (embed[0].fields.length !== 24) {
          buttons[0].components[1].setDisabled(true);
        }
        interaction.editReply({
          embeds: embed,
          components: buttons,
        });
      }
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
    filteredCourses = courseList.slice(24 * pageNumber);
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
