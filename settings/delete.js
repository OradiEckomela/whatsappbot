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
        msg.reply("❌ Je dois être admin pour supprimer un membre !");
        return;
    }

    // Vérifier qu'une personne est mentionnée
    const mention = msg.mentionedIds[0];
    if (!mention) {
        msg.reply("❌ Vous devez mentionner la personne à supprimer. Exemple : del @Nom");
        return;
    }

    try {
        await chat.removeParticipants([mention]);
        msg.reply(`✅ Le membre <@${mention}> a été supprimé du groupe.`);
    } catch (err) {
        console.log("Erreur suppression :", err.message);
        msg.reply("❌ Impossible de supprimer ce membre. Vérifiez mes droits ou que le membre est dans le groupe.");
    }
};
