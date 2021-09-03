import { ICommand } from "./command.interface";
import { PingCommand } from "./ping.command";
import { SayCommand } from "./say.command";
import { SourceCommand } from "./source.command";

const commands: ICommand[] = [
  new PingCommand(),
  new SayCommand(),
  new SourceCommand(),
];

export { commands, PingCommand, SayCommand, SourceCommand };
