import { CommandOption } from "@/commands/command.interface";

export const createCommandOptions: CommandOption[] = [
  {
    type: "String",
    name: "code",
    description: "CSC300-401",
    required: true,
  },
  {
    type: "String",
    name: "password",
    description: "Course password",
    required: false,
  },
  {
    type: "String",
    name: "description",
    description: '"Intro to Programming I"',
    required: false,
  },
  {
    type: "Boolean",
    name: "category",
    description: "Create a course category",
    required: false,
  },
  {
    type: "User",
    name: "owner",
    description: "Give someone rights over this course",
    required: false,
  },
  {
    type: "String",
    name: "linked_name",
    description: "Link this course with another course name.",
    required: false,
  },
  {
    type: "String",
    name: "quarter",
    description: "Create this course in another quarter.",
    required: false,
  },
];
