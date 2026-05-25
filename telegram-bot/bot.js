/**
 * KnowHub Ethiopia — Telegram Bot Script
 * Using: node-telegram-bot-api
 */

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Token received from @BotFather
const token = process.env.BOT_TOKEN || 'your-telegram-bot-token-here';
const webAppUrl = process.env.WEB_APP_URL || 'https://know-hub-ethiopia.vercel.app/';

// Initialize bot
const bot = new TelegramBot(token, { polling: true });

console.log('KnowHub Ethiopia Telegram Bot started successfully and listening for requests...');

// Helper: Get Main Keyboard markup with WebApp integration
const getMainKeyboard = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚀 Launch KnowHub Mini App', web_app: { url: webAppUrl } }
        ],
        [
          { text: '🏫 Discover Schools', web_app: { url: `${webAppUrl}?tab=schools` } },
          { text: '💰 Scholarships', web_app: { url: `${webAppUrl}?tab=scholarships` } }
        ],
        [
          { text: '🧪 English Test Prep', web_app: { url: `${webAppUrl}?tab=testprep` } },
          { text: '📚 Study Library', web_app: { url: `${webAppUrl}?tab=resources` } }
        ]
      ]
    }
  };
};

// 1. /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Student';

  const welcomeText = `👋 Hello ${firstName}! Welcome to *KnowHub Ethiopia* bot.\n\n` +
    `Your gateway to quality education in Ethiopia. Discover schools, apply for global scholarships, prepare for language tests (IELTS, TOEFL, DET), and access local study materials.\n\n` +
    `Click the options below to open our interactive Mini App directly within Telegram!`;

  bot.sendMessage(chatId, welcomeText, {
    parse_mode: 'Markdown',
    ...getMainKeyboard()
  });
});

// 2. /schools command
bot.onText(/\/schools/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🏫 Click the button below to browse 20+ verified Ethiopian high schools and universities:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🏫 Open Schools Database', web_app: { url: `${webAppUrl}?tab=schools` } }]
      ]
    }
  });
});

// 3. /scholarships command
bot.onText(/\/scholarships/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '💰 Click the button below to check active scholarships open for Ethiopian applicants:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💰 Open Scholarships', web_app: { url: `${webAppUrl}?tab=scholarships` } }]
      ]
    }
  });
});

// 4. /testprep command
bot.onText(/\/testprep/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🧪 Get comprehensive guidelines and take interactive prep quizzes for IELTS, TOEFL, and DET:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🧪 Open Language Test Prep', web_app: { url: `${webAppUrl}?tab=testprep` } }]
      ]
    }
  });
});

// 5. /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `*Available Commands:*\n\n` +
    `/start - Welcome screen and main app launcher\n` +
    `/schools - Direct link to the Schools database\n` +
    `/scholarships - Direct link to funding lists\n` +
    `/testprep - Direct link to IELTS/TOEFL/DET quiz modules\n` +
    `/help - List available commands\n\n` +
    `Need support? Reach out to @KnowHubSupport or check out our website.`;

  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Capture general messages
bot.on('message', (msg) => {
  const text = msg.text;
  
  // Skip command structures
  if (text && text.startsWith('/')) return;

  const chatId = msg.chat.id;
  const responseText = `I'm a helper bot designed to launch the KnowHub Mini App! Click the button below to get started:`;
  
  bot.sendMessage(chatId, responseText, getMainKeyboard());
});
