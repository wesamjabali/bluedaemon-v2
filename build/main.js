"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const handlers_1 = require("./handlers");
const config_service_1 = require("./services/config.service");
const client = new discord_js_1.Client(config_service_1.clientOptions);
handlers_1.handlers.forEach((handler) => {
    if (handler.once) {
        client.once(handler.EVENT_NAME, (...args) => handler.onEvent());
    }
    else {
        client.on(handler.EVENT_NAME, (...args) => handler.onEvent());
    }
});
client.login(config_service_1.config.envConfig.token);
