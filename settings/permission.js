const fs = require("fs");

const OWNER_NUMBER = "243840979238"; 

const PERMISSIONS_FILE = "./permissions.json";

// Charger ou créer le fichier permissions.json
function loadPermissions() {
    if (fs.existsSync(PERMISSIONS_FILE)) {
        return JSON.parse(fs.readFileSync(PERMISSIONS_FILE));
    }
    const defaultPerms = { mode: "everyone", blocked: [] };
    fs.writeFileSync(PERMISSIONS_FILE, JSON.stringify(defaultPerms));
    return defaultPerms;
}

function savePermissions(data) {
    fs.writeFileSync(PERMISSIONS_FILE, JSON.stringify(data));
}

module.exports = async (client, msg) => {
    const sender = msg.author || msg.from;
    const perms = loadPermissions();

    // Vérifier que seul le propriétaire peut changer les permissions
    if (sender !== OWNER_NUMBER) {
        msg.reply("❌ Seul le propriétaire du bot peut modifier les permissions.");
        return;
    }

    const args = msg.body.split(" ");

    switch (args[0].toLowerCase()) {
        case "everyone":
            perms.mode = "everyone";
            savePermissions(perms);
            msg.reply("✅ Le bot est maintenant accessible à tout le monde.");
            break;

        case "admin":
            perms.mode = "admin";
            savePermissions(perms);
            msg.reply("✅ Le bot est maintenant accessible uniquement aux administrateurs de groupe.");
            break;

        case "onlyme":
            perms.mode = "onlyme";
            savePermissions(perms);
            msg.reply("✅ Le bot est maintenant accessible uniquement au propriétaire.");
            break;

        case "bloc":
            if (!args[1]) {
                msg.reply("❌ Veuillez fournir le numéro à bloquer. Exemple : bloc 243812345678");
                return;
            }
            const numToBlock = args[1].replace(/\D/g, ""); // garder seulement les chiffres
            if (!perms.blocked.includes(numToBlock)) {
                perms.blocked.push(numToBlock);
                savePermissions(perms);
                msg.reply(`🚫 Le numéro ${numToBlock} est maintenant bloqué pour utiliser le bot.`);
            } else {
                msg.reply(`⚠️ Le numéro ${numToBlock} est déjà bloqué.`);
            }
            break;

        default:
            msg.reply("❌ Commande invalide. Utilisez : everyone | admin | onlyme | bloc <numéro>");
    }
};

// Fonction utilitaire pour vérifier si un utilisateur peut utiliser le bot
module.exports.checkPermission = async (client, msg) => {
    const sender = msg.author || msg.from;
    const chat = await msg.getChat();
    const perms = loadPermissions();

    // Bloqué explicitement ?
    const numberOnly = sender.replace(/\D/g, "");
    if (perms.blocked.includes(numberOnly)) {
        await msg.reply("❌ Vous êtes bloqué et ne pouvez pas utiliser le bot.");
        return false;
    }

    // Vérifier le mode global
    switch (perms.mode) {
        case "everyone":
            return true;

        case "admin":
            if (!chat.isGroup) return false; // privé = pas admin
            const author = chat.participants.find(p => p.id._serialized === sender);
            if (author && author.isAdmin) return true;
            await msg.reply("❌ Seuls les administrateurs peuvent utiliser cette commande.");
            return false;

        case "onlyme":
            if (sender === OWNER_NUMBER) return true;
            await msg.reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
            return false;

        default:
            return false;
    }
};
