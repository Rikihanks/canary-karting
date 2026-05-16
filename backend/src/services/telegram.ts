import { Telegraf } from 'telegraf';
import { config } from '../config.js';
import db from '../db.js';
import { sendNotification } from './onesignal.js';

const BOT_ACTIVATE_PREFIX = 'activate_';
const BOT_SKIP_PREFIX = 'skip_';
const BOT_NOTIFY_YES_PREFIX = 'notify_yes_';
const BOT_NOTIFY_NO_PREFIX = 'notify_no_';

export type RaceKey = `${string}|${string}|${number}`;

function makeKey(id_circuito: string, fecha: string, division: number): RaceKey {
    return `${id_circuito}|${fecha}|${division}`;
}

function parseKey(key: string): { id_circuito: string; fecha: string; division: number } {
    const parts = key.split('|');
    return { id_circuito: parts[0], fecha: parts[1], division: parseInt(parts[2], 10) };
}

let bot: Telegraf | null = null;

export function getBot(): Telegraf | null {
    return bot;
}

export function initBot(): boolean {
    if (!config.telegramBotToken) {
        console.warn('TELEGRAM_BOT_TOKEN not configured — Telegram bot disabled');
        return false;
    }

    if (!config.telegramChatId) {
        console.warn('TELEGRAM_CHAT_ID not configured — Telegram bot disabled');
        return false;
    }

    bot = new Telegraf(config.telegramBotToken);

    bot.action(/^(activate_|skip_)/, async (ctx) => {
        const prefix = ctx.match[1];
        const key = ctx.match.input.replace(prefix, '');
        const { id_circuito, fecha, division } = parseKey(key);
        const isActivate = prefix === BOT_ACTIVATE_PREFIX;

        try {
            if (isActivate) {
                db.prepare('UPDATE calendar SET activa = ? WHERE id_circuito = ? AND fecha = ? AND division = ?')
                    .run('1', id_circuito, fecha, division);
            }

            db.prepare(`UPDATE race_notifications SET activated = ?, responded_at = datetime('now') WHERE id_circuito = ? AND fecha = ? AND division = ?`)
                .run(isActivate ? 1 : 0, id_circuito, fecha, division);

            const raceName = (db.prepare("SELECT nombre FROM calendar WHERE id_circuito = ? AND fecha = ? AND division = ?")
                .get(id_circuito, fecha, division) as { nombre: string } | undefined)?.nombre || id_circuito;

            if (isActivate) {
                await ctx.editMessageText(
                    `✅ *${raceName}* activada.\n\n¿Quieres notificar a los pilotos?`,
                    {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '📢 Sí, notificar', callback_data: `${BOT_NOTIFY_YES_PREFIX}${key}` },
                                    { text: '🔇 No notificar', callback_data: `${BOT_NOTIFY_NO_PREFIX}${key}` },
                                ],
                            ],
                        },
                    }
                );
            } else {
                await ctx.editMessageText(`⏭ *${raceName}* — no se activó.`, { parse_mode: 'Markdown' });
            }
        } catch (err) {
            console.error('Telegram callback error (activate/skip):', err);
            await ctx.answerCbQuery('Error al procesar');
        }
    });

    bot.action(/^(notify_yes_|notify_no_)/, async (ctx) => {
        const prefix = ctx.match[1];
        const key = ctx.match.input.replace(prefix, '');
        const { id_circuito, fecha, division } = parseKey(key);
        const shouldNotify = prefix === BOT_NOTIFY_YES_PREFIX;

        try {
            if (shouldNotify) {
                const race = db.prepare("SELECT nombre, id_circuito, fecha, division FROM calendar WHERE id_circuito = ? AND fecha = ? AND division = ?")
                    .get(id_circuito, fecha, division) as { nombre: string; id_circuito: string; fecha: string; division: number } | undefined;

                if (race) {
                    const playerIds = config.oneSignalTestPlayerId ? [config.oneSignalTestPlayerId] : undefined;
                    await sendNotification(
                        `🏁 Carrera: ${race.nombre}`,
                        `La carrera del día ${race.fecha} ya está activa. Inscríbete ya! 🏁`,
                        `https://canarykarting.github.io/canary-karting-app/`,
                        playerIds
                    );
                }
            }

            db.prepare(`UPDATE race_notifications SET notified_pilots = ?, responded_at = datetime('now') WHERE id_circuito = ? AND fecha = ? AND division = ?`)
                .run(shouldNotify ? 1 : 0, id_circuito, fecha, division);

            const raceName = (db.prepare("SELECT nombre FROM calendar WHERE id_circuito = ? AND fecha = ? AND division = ?")
                .get(id_circuito, fecha, division) as { nombre: string } | undefined)?.nombre || id_circuito;

            if (shouldNotify) {
                await ctx.editMessageText(`✅ *${raceName}* división ${division} día ${fecha} — notificación enviada a los pilotos.`, { parse_mode: 'Markdown' });
            } else {
                await ctx.editMessageText(`🔇 *${raceName}* división ${division} día ${fecha} — no se notificó a los pilotos.`, { parse_mode: 'Markdown' });
            }
        } catch (err) {
            console.error('Telegram callback error (notify):', err);
            await ctx.answerCbQuery('Error al procesar');
        }
    });

    bot.launch().then(() => console.log('Telegram bot started')).catch(err => console.error('Telegram bot failed:', err));
    return true;
}

export function stopBot(): void {
    if (bot) bot.stop();
}

export async function sendRacePrompt(
    id_circuito: string,
    fecha: string,
    division: number,
    nombre: string
): Promise<boolean> {
    if (!bot) return false;

    const key = makeKey(id_circuito, fecha, division);
    const message =
        `🏁 *${nombre}*\n` +
        `📅 ${fecha}\n` +
        `📍 División ${division}\n\n` +
        `¿Quieres activar esta carrera?`;

    try {
        const sent = await bot.telegram.sendMessage(config.telegramChatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Activar', callback_data: `${BOT_ACTIVATE_PREFIX}${key}` },
                        { text: '⏭ Saltar', callback_data: `${BOT_SKIP_PREFIX}${key}` },
                    ],
                ],
            },
        });

        db.prepare(`INSERT OR IGNORE INTO race_notifications (id_circuito, fecha, division, nombre, chat_id, message_id, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`)
            .run(id_circuito, fecha, division, nombre, config.telegramChatId, sent.message_id);

        return true;
    } catch (err) {
        console.error('Telegram send error:', err);
        return false;
    }
}
