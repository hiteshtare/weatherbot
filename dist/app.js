"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const log4js_1 = require("log4js");
const botbuilder_1 = require("botbuilder");
const bot_1 = require("./bot");
const logger = log4js_1.getLogger();
logger.level = 'debug';
logger.warn(`setLoggerLevel : ${logger.level}`);
const MicrosoftAppId = process.env.DNA_GENEE_MICROSOFTAPPID;
const MicrosoftAppPassword = process.env.DNA_GENEE_MICROSOFTAPPPASSWORD;
logger.info(`MicrosoftAppId: ${MicrosoftAppId}`);
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: MicrosoftAppId,
    appPassword: MicrosoftAppPassword
});
const server = restify.createServer();
const port = process.env.port || process.env.PORT || 3978;
server.listen(port, () => {
    logger.warn(`Listening on port: ${port}`);
});
const weather = new bot_1.WeatherBot(adapter, logger);
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(void 0, void 0, void 0, function* () {
        yield weather.onTurn(context);
    }));
});
//# sourceMappingURL=app.js.map