import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

export const displayList = async (
  i: CommandInteraction,
  list: string[],
  listName: string,
  searchTerm?: string
) => {
  if (!i.deferred) {
    await i.deferReply();
  }

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
  const initialEmbed = getCourseListEmbedPage(
    list,
    pageNumber,
    listName,
    searchTerm
  );

  if (list.length <= 24) {
    i.followUp({ embeds: initialEmbed });
    return;
  }

  const sentReplyMessage = (await i.followUp({
    embeds: initialEmbed,
    components: buttons,
  })) as Message;

  const collector = sentReplyMessage.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 3000000,
  });
  collector.on("collect", async (b) => {
    if (b.user.id !== i.user.id) {
      await b.reply({
        content: "Sorry, only the command caller can do that.",
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
        embeds: getCourseListEmbedPage(
          list,
          --pageNumber,
          listName,
          searchTerm
        ),
        components: buttons,
      });
    }
    if (b.customId === "list-forward") {
      const embed = getCourseListEmbedPage(
        list,
        ++pageNumber,
        listName,
        searchTerm
      );
      buttons[0].components[0].setDisabled(false);
      if (embed[0].fields.length < 24) {
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
  listName: string,
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
    .setTitle(listName + (searchTerm ? ` with \`${searchTerm}\`` : ""))
    .setColor("BLUE");

  for (const c of filteredCourses) {
    currentEmbed.addField(`\`${c}\``, "​", true);
  }

  return [currentEmbed];
}
