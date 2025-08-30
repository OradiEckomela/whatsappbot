const reminders = [];

module.exports = {
    setReminder: async (client, msg, day, hour, minute, count, text) => {
        const chat = await msg.getChat();
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent créer un rappel.");

        for (let i = 0; i < count; i++) {
            const now = new Date();
            const reminderDate = new Date(now.getFullYear(), now.getMonth(), day, hour, minute + i*1);
            const timeout = reminderDate - now;
            if (timeout > 0) {
                setTimeout(() => {
                    msg.reply(`⏰ Rappel : ${text}`);
                }, timeout);
            }
        }
        msg.reply(`✅ Rappel programmé ${count} fois pour le jour ${day} à ${hour}:${minute}.`);
    }
};
