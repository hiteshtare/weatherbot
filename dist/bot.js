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
exports.WeatherBot = void 0;
const botbuilder_1 = require("botbuilder");
class WeatherBot {
    constructor(adapter, logger) {
        this._adapter = adapter;
        this._logger = logger;
    }
    onTurn(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.debug(`================${context.activity.channelId}================`);
            if (context.activity.type === botbuilder_1.ActivityTypes.Event || context.activity.type === botbuilder_1.ActivityTypes.Message) {
                this._logger.warn(`Typing... sent`);
                yield context.sendActivity({ type: botbuilder_1.ActivityTypes.Typing });
            }
            else {
                this._logger.info(`EventType:${context.activity.type} is detected`);
            }
        });
    }
}
exports.WeatherBot = WeatherBot;
//# sourceMappingURL=bot.js.map