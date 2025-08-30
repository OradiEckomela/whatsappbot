const fs = require("fs");
const BLACKLIST_FILE = "./blacklist.json";

// Charger ou créer le fichier
function loadBlacklist() {
    if (fs.existsSync(BLACKLIST_FILE)) {
        return JSON.parse(fs.readFileSync(BLACKLIST_FILE));
    }
    const defaultData = { words: [] };
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(defaultData));
    return defaultData;
}

function saveBlacklist(data) {
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(data));
}

module.exports = {
    checkMessage: async (client, msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return false;

        const blacklistData = loadBlacklist();
        const content = msg.body.toLowerCase();

        for (const word of blacklistData.words) {
            if (content.includes(word.toLowerCase())) {
                try {
                    await msg.delete(true);
                    await msg.reply(`⚠️ Message supprimé : mot interdit détecté.`);
                } catch (err) {
                    console.log("Erreur suppression anti-spam :", err.message);
                }
                return true;
            }
        }
        return false;
    },

    addWord: async (msg, word) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply("❌ Seulement dans un groupe.");
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent modifier la blacklist.");

        const data = loadBlacklist();
        if (!data.words.includes(word)) data.words.push(word);
        saveBlacklist(data);
        msg.reply(`✅ Mot "${word}" ajouté à la blacklist.`);
    },

    removeWord: async (msg, word) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply("❌ Seulement dans un groupe.");
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent modifier la blacklist.");

        const data = loadBlacklist();
        data.words = data.words.filter(w => w !== word);
        saveBlacklist(data);
        msg.reply(`✅ Mot "${word}" supprimé de la blacklist.`);
    },

    listWords: async (msg) => {
        const data = loadBlacklist();
        if (data.words.length === 0) return msg.reply("ℹ️ La blacklist est vide.");
        msg.reply("📋 Mots dans la blacklist :\n" + data.words.join(", "));
    }
};
