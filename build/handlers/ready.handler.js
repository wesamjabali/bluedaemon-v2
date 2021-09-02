"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyHandler = void 0;
const buildCommands_helper_1 = require("../helpers/buildCommands.helper");
class ReadyHandler {
    constructor() {
        this.once = true;
        this.EVENT_NAME = "ready";
        this.onEvent = () => {
            new buildCommands_helper_1.BuildCommands().execute();
            console.log("ready");
        };
    }
}
exports.ReadyHandler = ReadyHandler;
