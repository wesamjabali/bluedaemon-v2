"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyHandler = void 0;
const buildCommands_helper_1 = require("../helpers/buildCommands.helper");
class ReadyHandler {
    constructor() {
        this.once = true;
        this.EVENT_NAME = "ready";
        this.onEvent = async () => {
            await new buildCommands_helper_1.BuildCommands().execute();
            console.log(`Ready`);
        };
    }
}
exports.ReadyHandler = ReadyHandler;
