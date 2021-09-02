"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
class PingCommand {
    constructor() {
        this.name = "ping";
        this.description = "Pong!";
    }
    async execute(interaction) {
        const replyTime = new Date();
        await interaction.reply("Pong!");
        await interaction.editReply(`Pong! ${replyTime.getTime() - interaction.createdTimestamp}ms`);
    }
}
exports.PingCommand = PingCommand;
