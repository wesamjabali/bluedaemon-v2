"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildCommands = void 0;
const commands_1 = require("../commands");
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_service_1 = require("../services/config.service");
class BuildCommands {
    async execute() {
        const rest = new rest_1.REST({ version: "9" }).setToken(config_service_1.config.envConfig.token);
        const JSONCommands = [];
        commands_1.commands.forEach((command) => {
            JSONCommands.push(new builders_1.SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description)
                .toJSON());
        });
        config_service_1.config.envConfig.environment === "production"
            ? await rest.put(v9_1.Routes.applicationCommands(config_service_1.config.envConfig.clientId), {
                body: JSONCommands,
            })
            : await rest.put(v9_1.Routes.applicationGuildCommands(config_service_1.config.envConfig.clientId, config_service_1.config.envConfig.devGuildId), {
                body: JSONCommands,
            });
        console.log(`Built commands: [${Array.from(JSONCommands, (command) => command.name)}]`);
    }
}
exports.BuildCommands = BuildCommands;
