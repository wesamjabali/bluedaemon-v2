import { prisma } from "@/prisma/prisma.service";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { bulkDeleteCourses } from "./course-bulk-delete.service";
import { ButtonAction } from "@/buttons/button-action";

export class BulkDeleteCoursesCommand implements ICommand {
  name = "course-bulk-delete";
  description = "Delete a set of courses";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];
  buttonActions: ButtonAction[] = [
    { customId: "bulkdelete-confirm", execute: () => {} },
    { customId: "bulkdelete-cancel", execute: () => {} },
  ];

  options: CommandOption[] = [
    { type: "String", name: "quarter", required: true },
    {
      type: "String",
      name: "courses",
      required: true,
      description: 'Courses separated by a space. i.e: "CSC300 ANI230-401"',
    },
  ];

  async execute(i: CommandInteraction) {
    await i.deferReply();

    const quarter = i.options.getString("quarter", true);
    const courseCodes = i.options.getString("courses", true).toUpperCase();

    let coursesArray = courseCodes.split(" ");

    const dbQuarter = await prisma.quarter.findFirst({
      where: { name: quarter, guild: { guildId: i.guild?.id } },
    });

    if (!dbQuarter) {
      await i.followUp(
        `${quarter} is not a valid quarter. Available quarters are: \`\`\`${(
          await prisma.quarter.findMany({
            where: { guild: { guildId: i.guildId as string } },
            select: { name: true },
          })
        )
          .flatMap((c) => c.name)
          .join(", ")}\`\`\``
      );
      return;
    }

    const sentReplyMessage = (await i.followUp({
      content: `Are you sure you want to delete the following courses? This action cannot be undone!\`\`\`${coursesArray.join(
        ", "
      )}\`\`\``,
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("bulkdelete-confirm")
            .setLabel("Confirm")
            .setStyle("DANGER"),
          new MessageButton()
            .setCustomId("bulkdelete-cancel")
            .setLabel("Cancel")
            .setStyle("SECONDARY"),
        ]),
      ],
    })) as Message;

    const collector = sentReplyMessage.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 300000,
    });

    collector.on("collect", async (j) => {
      if (j.user.id !== i.user.id) {
        await j.reply({
          content: "You're not allowed to do that.",
          ephemeral: true,
        });
        return;
      }
      if (j.customId === "bulkdelete-confirm") {
        await i
          .editReply({
            content: `\`\`\`${await bulkDeleteCourses(
              coursesArray,
              i.guildId as string,
              quarter
            )}\`\`\``,
            components: [],
          })
          .catch(async () => {
            await i.editReply({ content: "Done!", components: [] });
          });
      } else {
        await i.editReply({
          content: `Bulkdelete operation canceled.`,
          components: [],
        });
      }
    });
  }
}
