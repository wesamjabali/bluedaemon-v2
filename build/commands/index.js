"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = exports.commands = void 0;
const ping_command_1 = require("./ping.command");
Object.defineProperty(exports, "PingCommand", { enumerable: true, get: function () { return ping_command_1.PingCommand; } });
const commands = [new ping_command_1.PingCommand()];
exports.commands = commands;
