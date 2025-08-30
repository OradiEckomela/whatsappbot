const fs = require("fs");
const WARN_FILE = "./warnings.json";

function loadWarnings() {
    if (fs.existsSync(WARN_FILE)) return JSON.parse(fs.readFileSync(WARN_FILE));
    const defaultData = { settings: { maxWarnings: 3, sanction: "mute" }, users: {} };
    fs.writeFileSync(WARN_FILE, JSON.stringify(defaultData));
    return defaultData;
}

function saveWarnings(data) {
    fs.writeFileSync(WARN_FILE, JSON.stringify(data));
}

module.exports = {
    warnUser: async (client, msg, userId) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return;

        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent donner des avertissements.");

        const data = loadWarnings();
        if (!data.users[userId]) data.users[userId] = 0;

        data.users[userId]++;
        const warnCount = data.users[userId];
        saveWarnings(data);

        await msg.reply(`⚠️ <@${userId}> a reçu un avertissement (${warnCount}/${data.settings.maxWarnings})`);

        if (warnCount >= data.settings.maxWarnings) {
            if (data.settings.sanction === "mute") {
                try {
                    await chat.removeParticipants([userId]); // ou mettre en sourdine si tu implémentes mute
                    await msg.reply(`🔇 <@${userId}> a été sanctionné (mute)`);
                } catch {
                    await msg.reply("❌ Impossible d'appliquer la sanction. Vérifie mes droits d'admin.");
                }
            } else if (data.settings.sanction === "ban") {
                try {
                    await chat.removeParticipants([userId]);
                    await msg.reply(`⛔ <@${userId}> a été banni du groupe`);
                } catch {
                    await msg.reply("❌ Impossible de bannir l'utilisateur.");
                }
            }
            data.users[userId] = 0;
            saveWarnings(data);
        }
    },

    setSettings: async (msg, maxWarnings, sanction) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply("❌ Seulement dans un groupe.");
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent changer les réglages.");

        const data = loadWarnings();
        data.settings.maxWarnings = maxWarnings;
        data.settings.sanction = sanction; // "mute" ou "ban"
        saveWarnings(data);
        msg.reply(`✅ Paramètres mis à jour : maxWarnings=${maxWarnings}, sanction=${sanction}`);
    }
};
