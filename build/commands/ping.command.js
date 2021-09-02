"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
class PingCommand {
    constructor() {
        this.name = "ping";
        this.description = "Returns ping time";
    }
    execute(interaction) {
        interaction.channel?.send("Hello!");
    }
}
exports.PingCommand = PingCommand;
