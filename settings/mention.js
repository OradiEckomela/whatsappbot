module.exports = async (client, msg) => {
    // Vérifier si le message est dans un groupe
    if (!msg.from.endsWith("@g.us")) {
        msg.reply("❌ Cette commande fonctionne seulement dans un groupe.");
        return;
    }

    // Récupérer les infos du groupe
    const chat = await msg.getChat();

    // Vérifier si l'auteur du message est admin
    const author = await chat.participants.find(p => p.id._serialized === msg.author || p.id._serialized === msg.from);
    if (!author || !author.isAdmin) {
        msg.reply("❌ Vous devez être administrateur pour utiliser cette commande.");
        return;
    }

    const members = chat.participants;
    let text = `📢 [${chat.name}]\n`;
    text += `[Message de : ${msg._data.notifyName || "Inconnu"}]\n`;
    text += `[Nombre de membres : ${members.length}]\n\n`;

    // Ajouter tous les membres
    members.forEach((member, index) => {
        const name = member.id.user;
        text += `${index + 1}. ${name}\n`;
    });

    // Envoyer le message avec mentions
    const mentions = members.map(m => m.id);
    await chat.sendMessage(text, { mentions });
};
