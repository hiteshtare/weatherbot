// Import node modules
import * as restify from 'restify';
import { getLogger } from 'log4js';

// Import bot services
import { BotFrameworkAdapter, TurnContext } from 'botbuilder';
import { WeatherBot } from './bot';

// To set logger level global using ENV
const logger = getLogger();
logger.level = 'debug';
logger.warn(`setLoggerLevel : ${logger.level}`);

const MicrosoftAppId = process.env.DNA_GENEE_MICROSOFTAPPID;//APP_CONFIG.MicrosoftAppId;
const MicrosoftAppPassword = process.env.DNA_GENEE_MICROSOFTAPPPASSWORD;//APP_CONFIG.MicrosoftAppPassword;

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: MicrosoftAppId,
  appPassword: MicrosoftAppPassword
});

// Create HTTP server
const server = restify.createServer();

const port = process.env.port || process.env.PORT || 3977;
server.listen(port, () => {
  logger.warn(`Weather Bot is listening on port: ${port}`);
});

// Create the main dialog.
const weather: WeatherBot = new WeatherBot(adapter, logger);

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    // Route to main dialog.
    await weather.onTurn(context);
  });
});