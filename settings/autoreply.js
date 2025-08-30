const fs = require("fs");
const FAQ_FILE = "./faq.json";

function loadFAQ() {
    if (fs.existsSync(FAQ_FILE)) return JSON.parse(fs.readFileSync(FAQ_FILE));
    const defaultData = { list: [] };
    fs.writeFileSync(FAQ_FILE, JSON.stringify(defaultData));
    return defaultData;
}

function saveFAQ(data) {
    fs.writeFileSync(FAQ_FILE, JSON.stringify(data));
}

module.exports = {
    checkMessage: async (msg) => {
        const content = msg.body.toLowerCase();
        const data = loadFAQ();
        for (const faq of data.list) {
            if (content.includes(faq.keyword.toLowerCase())) {
                await msg.reply(faq.reply);
                return true;
            }
        }
        return false;
    },

    addKeyword: async (msg, keyword, reply) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply("❌ Seulement dans un groupe.");
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent ajouter un mot clé.");

        const data = loadFAQ();
        data.list.push({ keyword, reply });
        saveFAQ(data);
        msg.reply(`✅ Mot clé "${keyword}" ajouté avec la réponse.`);
    },

    removeKeyword: async (msg, keyword) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply("❌ Seulement dans un groupe.");
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author.isAdmin) return msg.reply("❌ Seuls les admins peuvent supprimer un mot clé.");

        const data = loadFAQ();
        data.list = data.list.filter(faq => faq.keyword !== keyword);
        saveFAQ(data);
        msg.reply(`✅ Mot clé "${keyword}" supprimé.`);
    }
};
