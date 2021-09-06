import { CommandOption } from "../../../commands/command.interface";

export const joinCommandOptions: CommandOption[] = [
  {
    type: "String",
    name: "course",
    description: "ex: CSC300-401 - Name of the course you'd like to join.",
    required: true,
  },
  {
    type: "String",
    name: "password",
    description: "Password given to you by your professor.",
    required: false,
  },
];
