import { ICommand } from "./command.interface";
import { PingCommand } from "./ping.command";
import { SayCommand } from "./say.command";
import { SourceCommand } from "./source.command";
import { SudoCommand } from "./sudo.command";

const commands: ICommand[] = [
  new PingCommand(),
  new SourceCommand(),
  new SudoCommand(),
];

export { commands, PingCommand, SayCommand, SourceCommand, SudoCommand };
