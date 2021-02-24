// Import node modules
import { Logger } from "log4js";
import request = require('request-promise');
import * as moment from 'moment';

// Import bot services
import { BotAdapter, TurnContext, ActivityTypes, CardFactory } from "botbuilder";

import { APP_CONFIG } from './config';
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

      const weatherCard = await this.getWeatherCardByCoordinates();

      //============================Adaptive Card============================
      await context.sendActivity({
        attachments: [CardFactory.adaptiveCard(weatherCard)]
      });
      //============================Adaptive Card============================


    } else {
      this._logger.info(`EventType:${context.activity.type} is detected`);
    }
  }


  async getWeatherCardByCoordinates() {
    this._logger.warn(`getWeatherCardByCoordinates`);

    const fetchedWeatherDetails = await this.fetchWeatherDetails();
    this._logger.info(`Fetched Weather Details!`);
    this._logger.debug(fetchedWeatherDetails);

    const cardInfo = {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "speak": `<s>The forecast for ${fetchedWeatherDetails.name} November 5 is ${fetchedWeatherDetails.weather[0].description} with a High of ${fetchedWeatherDetails.main.temp_max} degrees and Low of ${fetchedWeatherDetails.main.temp_min} degrees</s>`,
      "body": [
        {
          "type": "TextBlock",
          "text": `${fetchedWeatherDetails.name}, ${fetchedWeatherDetails.sys.country}`,
          "size": "Large",
          "isSubtle": true,
          "wrap": true
        },
        {
          "type": "TextBlock",
          "text": `${await this.formatDateForCard()}`,
          // "text": `Feb 24, 2021`,
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
                  "url": `http://openweathermap.org/img/wn/${fetchedWeatherDetails.weather[0].icon}.png`,
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
                  "text": `${Math.round(+fetchedWeatherDetails.main.temp)}`,
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
                  "text": "°C",
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
                  "text": `Hi ${fetchedWeatherDetails.main.temp_max}`,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": `Lo ${fetchedWeatherDetails.main.temp_min}`,
                  "spacing": "None",
                  "wrap": true
                }
              ]
            }
          ]
        }
      ]
    };

    return cardInfo;
  }

  async fetchWeatherDetails() {
    this._logger.info(`fetchWeatherDetails`);

    const weatherDetailsUri = `https://api.openweathermap.org/data/2.5/weather?lat=${APP_CONFIG.latitude}&lon=${APP_CONFIG.longitude}&appid=${APP_CONFIG.openWeatherAPIKey}&units=metric`;
    this._logger.debug(`weatherDetailsUri : ${weatherDetailsUri}`);

    //GET Request for fetching GeneeConfig
    const getOptions = {
      method: 'GET',
      uri: weatherDetailsUri,
    };

    return await request(getOptions)
      .then((resp: any) => {
        this._logger.info(`WeatherDetails fetched successfully.`);
        return JSON.parse(resp);
      }).catch((err) => {
        this._logger.error(err);
      });
  }

  async formatDateForCard(): Promise<string> {
    try {
      return moment().format("ddd MMM DD, YYYY hh:mm A").toString();
    } catch (err) {
      this._logger.error(err);
      return '';
    }
  }
}

