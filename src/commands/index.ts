import { ICommand } from "./command.interface";
import { PingCommand } from "./ping.command";

const commands: ICommand[] = [new PingCommand()];

export { commands, PingCommand };
