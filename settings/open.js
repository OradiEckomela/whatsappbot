module.exports = async (client, msg) => {
    const chat = await msg.getChat();

    // Vérifier que c'est un groupe
    if (!chat.isGroup) {
        msg.reply("❌ Cette commande ne fonctionne que dans un groupe.");
        return;
    }

    // Vérifier que l'auteur est admin
    const author = chat.participants.find(p => p.id._serialized === msg.author);
    if (!author || !author.isAdmin) {
        msg.reply("❌ Seuls les administrateurs peuvent utiliser cette commande.");
        return;
    }

    // Vérifier que le bot est admin
    const botMe = chat.participants.find(p => p.id._serialized === client.info.wid._serialized);
    if (!botMe.isAdmin) {
        msg.reply("❌ Je dois être admin pour réouvrir le groupe.");
        return;
    }

    try {
        await chat.setMessagesAdminsOnly(false); // Désactive mode lecture seule
        msg.reply("✅ Le groupe est maintenant ouvert, tous les membres peuvent envoyer des messages.");
    } catch (err) {
        console.log("Erreur open :", err.message);
        msg.reply("❌ Impossible de réouvrir le groupe. Vérifie mes droits d'admin.");
    }
};
