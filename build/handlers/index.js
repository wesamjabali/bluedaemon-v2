"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCreateHandler = exports.ReadyHandler = exports.handlers = void 0;
const interactionCreate_1 = require("./interactionCreate");
Object.defineProperty(exports, "InteractionCreateHandler", { enumerable: true, get: function () { return interactionCreate_1.InteractionCreateHandler; } });
const ready_handler_1 = require("./ready.handler");
Object.defineProperty(exports, "ReadyHandler", { enumerable: true, get: function () { return ready_handler_1.ReadyHandler; } });
const handlers = [
    new ready_handler_1.ReadyHandler(),
    new interactionCreate_1.InteractionCreateHandler(),
];
exports.handlers = handlers;
