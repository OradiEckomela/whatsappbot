const fs = require("fs");

module.exports = {
    setWelcomeMessage: async (client, msg) => {
        const chat = await msg.getChat();

        // Vérifier que c'est un groupe
        if (!msg.from.endsWith("@g.us")) {
            msg.reply("❌ Cette commande ne fonctionne que dans un groupe.");
            return;
        }

        // Vérifier que l'auteur est admin
        const author = chat.participants.find(p => p.id._serialized === msg.author);
        if (!author || !author.isAdmin) {
            msg.reply("❌ Vous devez être administrateur pour définir le message de bienvenue.");
            return;
        }

        // Extraire le message de bienvenue
        const welcomeText = msg.body.replace(/^welcome\s*/i, "").trim();
        if (!welcomeText) {
            msg.reply("❌ Veuillez écrire le message de bienvenue après la commande. Exemple :\nwelcome Bienvenue {member} dans le groupe !");
            return;
        }

        // Lire le fichier welcome.json
        const welcomeFile = "./welcome.json";
        let welcomeData = {};
        if (fs.existsSync(welcomeFile)) {
            welcomeData = JSON.parse(fs.readFileSync(welcomeFile));
        }

        // Sauvegarder le message pour ce groupe
        welcomeData[chat.id._serialized] = welcomeText;
        fs.writeFileSync(welcomeFile, JSON.stringify(welcomeData));

        msg.reply(`✅ Message de bienvenue défini pour ce groupe :\n${welcomeText}`);
    }
};
