"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCreateHandler = void 0;
const commands_1 = require("../commands");
class InteractionCreateHandler {
    constructor() {
        this.once = false;
        this.EVENT_NAME = "interactionCreate";
    }
    async onEvent(interaction) {
        if (interaction.isCommand()) {
            const command = commands_1.commands.find((c) => c.name === interaction.commandName);
            command?.execute(interaction);
        }
    }
    ;
}
exports.InteractionCreateHandler = InteractionCreateHandler;
