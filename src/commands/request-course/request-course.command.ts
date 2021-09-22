import {
  ButtonInteraction,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import {
  CommandOption,
  CommandOptionPermission,
  ICommand,
} from "@/commands/command.interface";
import { ButtonAction } from "@/buttons/button-action";
import { getGuildConfig } from "@/config/guilds.config";
import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { createCourse } from "../create-course/create-course.service";

export class RequestCourseCommand implements ICommand {
  name = "request-course";
  description = "Request a course if it doesn't already exist.";
  default_permission = false;
  permissions: CommandOptionPermission[] = [
    { type: "CourseManager", permission: true },
  ];
  buttonActions: ButtonAction[] = [
    {
      customId: "request-course-confirm",
      execute: async (i: ButtonInteraction) => {
        const paramsMatcher = Array.from(
          i.message.content.matchAll(/`(.*)`/g),
          (m) => m[1]
        );

        if (paramsMatcher.length !== 2) return;

        const responseMessage = await i.reply({
          content: `Approved by ${i.user}\n\n${await createCourse(
            i.guild,
            paramsMatcher[0],
            paramsMatcher[1],
            null,
            null,
            null,
            null,
            null
          )}`,
          fetchReply: true,
        });

        await (i.message as Message).edit({
          content:
            i.message.content +
            `\n\nResponse by ${i.user}: ${(responseMessage as Message).url}`,
          components: [],
        });
        try {
          (i.message as Message).mentions.users
            .first()
            ?.send(
              `Your course request for ${paramsMatcher[0]} was approved in ${i.guild?.name}! Use \`/join-course ${paramsMatcher[0]}\` to join the course.`
            );
        } catch {}
      },
    },
    {
      customId: "request-course-deny",
      execute: async (i: ButtonInteraction) => {
        const paramsMatcher = Array.from(
          i.message.content.matchAll(/`(.*)`/g),
          (m) => m[1]
        );

        const responseMessage = await i.reply({
          content: `Denied by ${i.user}.`,
          fetchReply: true,
        });

        await (i.message as Message).edit({
          content:
            i.message.content +
            `\n\nResponse by ${i.user}: ${(responseMessage as Message).url}`,
          components: [],
        });

        try {
          (i.message as Message).mentions.users
            .first()
            ?.send(
              `Your course request for ${paramsMatcher[0]} was denied in ${i.guild?.name}.`
            );
        } catch {}
      },
    },
  ];

  options: CommandOption[] = [
    {
      type: "String",
      name: "course",
      required: true,
      description: 'Courses separated by a space. i.e: "CSC300 ANI230-401"',
    },
    {
      type: "String",
      name: "description",
      required: false,
      description: "Add more information to your request.",
    },
  ];

  async execute(i: CommandInteraction) {
    const guildConfig = getGuildConfig(i.guildId);
    const courseCode = normalizeCourseCode(i.options.getString("course", true));
    const description = i.options.getString("description", false);

    const dbQuarter = guildConfig?.currentQuarter;
    const courseRequestChannel = i.guild?.channels.cache.find(
      (c) => c.id === guildConfig?.courseRequestsChannelId
    ) as TextChannel;

    if (!courseRequestChannel) {
      await i.reply(
        "Course requests are not enabled by the guild owner. Please ask them to reset their course request channel."
      );
      return;
    }

    if (
      !!guildConfig?.courses.find(
        (c) =>
          c.quarterId === dbQuarter?.id &&
          c.aliases.includes(courseCode.courseName)
      )
    ) {
      await i.reply(
        `${courseCode.courseName} already exists! You can join it by using: \`\`\`/join-course ${courseCode.courseName}\`\`\``
      );
      return;
    }
    const sentReplyMessage = await i.reply({
      content: `Request sent. Course: \`${
        courseCode.courseName
      }\`\nAdditional Info: \`${description || "None provided"}\``,
      fetchReply: true,
    });

    const courseRequestMessage = await courseRequestChannel.send({
      content: `New request from ${i.user} at ${
        (sentReplyMessage as Message).url
      }\n\nCourse: \`${courseCode.courseName}\`
Additional info: \`${description || "None provided"}\``,
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("request-course-confirm")
            .setStyle("SUCCESS")
            .setLabel("Approve"),
          new MessageButton()
            .setCustomId("request-course-deny")
            .setStyle("SECONDARY")
            .setLabel("Deny"),
        ]),
      ],
    });
  }
}
