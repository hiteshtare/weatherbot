// Import node modules
import { Logger } from "log4js";

// Import bot services
import { BotAdapter, TurnContext, ActivityTypes, CardFactory } from "botbuilder";

export class WeatherBot {
  private _adapter: BotAdapter;
  private _logger: Logger;


  constructor(adapter: BotAdapter, logger: Logger) {
    this._adapter = adapter;
    this._logger = logger;
  }

  async onTurn(context: TurnContext): Promise<void> {
    this._logger.debug(`================${context.activity.channelId}================`);

    if (context.activity.type === ActivityTypes.Event || context.activity.type === ActivityTypes.Message) {
      this._logger.warn(`Typing... sent`);
      //send Typing Indicator
      await context.sendActivity({ type: ActivityTypes.Typing });


      this._logger.warn(`sending... Weather Card`);

      const cardInfo = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "speak": "<s>The forecast for Seattle November 5 is mostly clear with a High of 50 degrees and Low of 41 degrees</s>",
        "body": [
          {
            "type": "TextBlock",
            "text": "Redmond, WA",
            "size": "Large",
            "isSubtle": true,
            "wrap": true
          },
          {
            "type": "TextBlock",
            "text": "2019-11-05",
            "spacing": "None",
            "wrap": true
          },
          {
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "width": "auto",
                "items": [
                  {
                    "type": "Image",
                    "url": "https://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Square.png",
                    "size": "Small"
                  }
                ]
              },
              {
                "type": "Column",
                "width": "auto",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "46",
                    "size": "ExtraLarge",
                    "spacing": "None",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Column",
                "width": "stretch",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "°F",
                    "weight": "Bolder",
                    "spacing": "Small",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Column",
                "width": "stretch",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Hi 50",
                    "wrap": true
                  },
                  {
                    "type": "TextBlock",
                    "text": "Lo 41",
                    "spacing": "None",
                    "wrap": true
                  }
                ]
              }
            ]
          }
        ]
      };
      //============================Adaptive Card============================
      await context.sendActivity({
        attachments: [CardFactory.adaptiveCard(cardInfo)]
      });
      //============================Adaptive Card============================


    } else {
      this._logger.info(`EventType:${context.activity.type} is detected`);
    }
  }
}
