"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyHandler = void 0;
const buildCommands_helper_1 = require("../helpers/buildCommands.helper");
const config_service_1 = require("../services/config.service");
class ReadyHandler {
    constructor() {
        this.once = true;
        this.EVENT_NAME = "ready";
        this.onEvent = async () => {
            await new buildCommands_helper_1.BuildCommands().execute();
            console.log(`Running in ${config_service_1.config.envConfig.environment} mode.`);
        };
    }
}
exports.ReadyHandler = ReadyHandler;
