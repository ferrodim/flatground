
// const TelegramBot = require('node-telegram-bot-api');
// const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: {interval: 1000}});


const RabbitService = require('./services/rabbit');
const MongoService = require('./services/mongo');

module.exports = {
    mongo: new MongoService(),
    rabbit: new RabbitService(),
    _:_=>_,
};