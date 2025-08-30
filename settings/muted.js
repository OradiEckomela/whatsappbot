const fs = require("fs");

module.exports = async (client, msg) => {
    const chat = await msg.getChat();

    // Vérifier que c'est un groupe
    if (!msg.from.endsWith("@g.us")) {
        msg.reply("❌ Cette commande ne fonctionne que dans un groupe.");
        return;
    }

    // Vérifier que l'auteur est admin
    const author = chat.participants.find(p => p.id._serialized === msg.author);
    if (!author || !author.isAdmin) {
        msg.reply("❌ Vous devez être administrateur pour utiliser cette commande.");
        return;
    }

    // Vérifier que le bot est admin
    const botMe = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
    if (!botMe.isAdmin) {
        msg.reply("❌ Je dois être admin pour supprimer les messages des membres !");
        return;
    }

    // Format attendu : muted @Personne 31-08 18:30
    const parts = msg.body.split(" ");
    if (parts.length !== 3) {
        msg.reply("❌ Format invalide. Exemple : muted @Nom 31-08 18:30");
        return;
    }

    const mention = msg.mentionedIds[0]; // ID WhatsApp de la personne mentionnée
    if (!mention) {
        msg.reply("❌ Vous devez mentionner la personne à muter.");
        return;
    }

    const dayMonth = parts[1].split("-");
    const time = parts[2].split(":");
    if (dayMonth.length !== 2 || time.length !== 2) {
        msg.reply("❌ Format de date/heure invalide. Exemple : 31-08 18:30");
        return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const endDate = new Date(year, parseInt(dayMonth[1]) - 1, parseInt(dayMonth[0]), parseInt(time[0]), parseInt(time[1]));

    const mutedList = fs.existsSync("./muted.json") ? JSON.parse(fs.readFileSync("./muted.json")) : [];
    mutedList.push({
        chatId: msg.from,
        userId: mention,
        end: endDate
    });

    fs.writeFileSync("./muted.json", JSON.stringify(mutedList));
    msg.reply(`🔇 <@${mention}> est muté jusqu'au ${parts[1]} ${parts[2]}`);
};
