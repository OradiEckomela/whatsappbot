const fs = require("fs");
const TOP_FILE = "./top.json";

function loadTop() {
    if (fs.existsSync(TOP_FILE)) return JSON.parse(fs.readFileSync(TOP_FILE));
    const defaultData = {};
    fs.writeFileSync(TOP_FILE, JSON.stringify(defaultData));
    return defaultData;
}

function saveTop(data) {
    fs.writeFileSync(TOP_FILE, JSON.stringify(data));
}

module.exports = {
    trackMessage: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return;

        const userId = msg.author || msg.from;
        const data = loadTop();
        if (!data[userId]) data[userId] = 0;
        data[userId]++;
        saveTop(data);
    },

    showTop: async (msg) => {
        const data = loadTop();
        const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
        let text = "🏆 Top des contributions :\n";
        sorted.slice(0, 10).forEach(([user, count], i) => {
            text += `${i + 1}. <@${user}> : ${count} messages\n`;
        });
        msg.reply(text);
    }
};
