import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    enableV3: process.env.ENABLE_V3 === 'true',
    oneSignalAppId: process.env.ONESIGNAL_APP_ID || '',
    oneSignalApiKey: process.env.ONESIGNAL_API_KEY || '',
    oneSignalTestPlayerId: process.env.ONESIGNAL_TEST_PLAYER_ID || '',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
};
