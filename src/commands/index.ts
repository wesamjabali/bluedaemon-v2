import { ICommand } from "./command.interface";
import { PingCommand } from "./ping/ping.command";
import { SayCommand } from "./say/say.command";
import { SourceCommand } from "./source/source.command";
import { SudoCommand } from "./sudo/sudo.command";

const commands: ICommand[] = [
  new PingCommand(),
  new SourceCommand(),
  new SudoCommand(),
];

export { commands, PingCommand, SayCommand, SourceCommand, SudoCommand };
