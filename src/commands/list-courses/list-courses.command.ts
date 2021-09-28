import { Course } from ".prisma/client";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { getGuildConfig } from "@/config/guilds.config";
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

  buttonActions = [];

  options: CommandOption[] = [
    {
      type: "String",
      name: "search",
      description: "Search term for courses",
      required: false,
    },
  ];

  public async execute(i: CommandInteraction): Promise<void> {
    i.deferReply();
    const guildConfig = getGuildConfig(i.guildId as string);
    const searchTerm = i.options.getString("search", false)?.toUpperCase();

    let courses =
      (
        guildConfig?.courses.filter(
          (c) => c.quarterId === guildConfig.currentQuarterId && !c.password
        ) as Course[]
      ).sort((a, b) => (a.aliases[0] < b.aliases[0] ? -1 : 1)) ||
      ([] as Course[]);

    let filteredCourses: string[] = [];
    for (const c of courses) {
      filteredCourses.push(
        ...c.aliases.filter((a) => a.includes(searchTerm ?? ""))
      );
    }

    displayList(i, filteredCourses, searchTerm);
  }
}

const displayList = async (
  i: CommandInteraction,
  list: string[],
  searchTerm?: string
) => {
  let pageNumber = 0;

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
  const initialEmbed = getCourseListEmbedPage(list, pageNumber, searchTerm);

  if (list.length <= 24) {
    i.followUp({ embeds: initialEmbed });
    return;
  }

  if (initialEmbed[0].fields.length !== 24) {
    buttons[0].components[1].setDisabled(true);
  }
  const sentReplyMessage = (await i.followUp({
    embeds: initialEmbed,
    components: buttons,
  })) as Message;

  const collector = sentReplyMessage.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 300000,
  });
  collector.on("collect", async (b) => {
    if (b.user.id !== i.user.id) {
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
      i.editReply({
        embeds: getCourseListEmbedPage(list, --pageNumber, searchTerm),
        components: buttons,
      });
    }
    if (b.customId === "list-forward") {
      const embed = getCourseListEmbedPage(list, ++pageNumber, searchTerm);
      buttons[0].components[0].setDisabled(false);
      if (embed[0].fields.length !== 24) {
        buttons[0].components[1].setDisabled(true);
      }
      i.editReply({
        embeds: embed,
        components: buttons,
      });
    }
  });
};

function getCourseListEmbedPage(
  courseList: string[],
  pageNumber: number,
  searchTerm?: string
): MessageEmbed[] {
  let filteredCourses = courseList.slice(
    24 * pageNumber,
    24 * (pageNumber + 1)
  );
  if (filteredCourses.length === 0) {
    filteredCourses = courseList.slice(24 * pageNumber);
  }

  let currentEmbed = new MessageEmbed();
  currentEmbed
    .setTitle("Courses " + (searchTerm ? `with \`${searchTerm}\`` : ""))
    .setColor("BLUE");

  for (const c of filteredCourses) {
    currentEmbed.addField(`\`${c}\``, "​", true);
  }

  return [currentEmbed];
}
