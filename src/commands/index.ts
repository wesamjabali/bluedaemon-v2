import { ICommand } from "./command.interface";
import { PingCommand } from "./ping.command";
import { SayCommand } from "./say.command";

const commands: ICommand[] = [new PingCommand(), new SayCommand()];

export { commands, PingCommand, SayCommand };
