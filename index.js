const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// replace the value below with the Telegram token you receive from @BotFather
const token = '867452519:AAFD18Z4Z3cFDJGJo1DKo2g-BSfd6nf4HZk';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});
bot.onText(/\/curse/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Выберите валюту, пожалуйста:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'EUR 💶',
                        callback_data: 'EUR'
                    },
                    {
                        text: '$ USD 💵',
                        callback_data: 'USD'
                    },
                    {
                        text: 'Ƀ BTC ',
                        callback_data: 'BTC'
                    }
                ]
            ]
        }
    });
});
bot.on('callback_query', query => {
    const id = query.message.chat.id;
    request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
        {
            const data = JSON.parse(body);
            const result = data.filter(item => item.ccy === query.data)[0];
            const flag = {
                'EUR': '🇪🇺',
                'USD': '🇺🇸',
                'RUR': '🇷🇺',
                'UAH': '🇺🇦',
                'BTC': 'Ƀ'

            }
            let md =`
                *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
                Buy: _${result.buy}_
                Sale: _${result.sale}_
            `;
            bot.sendMessage(id, md, {parse_mode: 'Markdown'});
        }
    });
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
});