"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.clientOptions = exports.ConfigService = void 0;
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
class ConfigService {
    constructor() {
        dotenv_1.default.config();
    }
    get envConfig() {
        return {
            token: process.env.CLIENT_TOKEN,
            environment: "development",
            clientId: "820141085014753321",
            devGuildId: "753687465784770630",
        };
    }
}
exports.ConfigService = ConfigService;
exports.clientOptions = {
    intents: [discord_js_1.Intents.FLAGS.GUILDS],
    presence: {
        status: "online",
        activities: [
            { name: "BlueDaemon", type: "PLAYING", url: "https://wesamjabali.com" },
        ],
    },
};
exports.config = new ConfigService();
