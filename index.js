const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Commandes
const antispam = require("./commands/antispam");
const warnings = require("./commands/warnings");
const autoReply = require("./commands/autoReply");
const top = require("./commands/top");
const reminder = require("./commands/reminder");
const settings = require("./commands/settings");
const tag = require("./commands/tag");
const muted = require("./commands/muted");
const welcome = require("./commands/welcome");
const del = require("./commands/del");
const permissions = require("./commands/permissions");
const close = require("./commands/close");
const open = require("./commands/open");

// Préfixe pour toutes les commandes
const prefix = "!";

// Initialisation client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scanne le QR code avec ton téléphone.");
});

client.on("ready", () => {
    console.log("Bot WhatsApp prêt !");
});

client.on("message", async (msg) => {
    // Ignore les messages qui ne commencent pas par le préfixe
    if (!msg.body.startsWith(prefix)) return;

    // Enlève le préfixe et récupère les arguments
    const args = msg.body.slice(prefix.length).trim().split(" ");
    const command = args[0].toLowerCase();

    // Anti-spam et blacklist
    await antispam.checkMessage(client, msg);

    // Réponses automatiques
    await autoReply.checkMessage(msg);

    // Top des contributions
    await top.trackMessage(msg);

    // Commandes
    switch (command) {
        // Blacklist
        case "addblacklist": await antispam.addWord(msg, args.slice(1).join(" ")); break;
        case "removeblacklist": await antispam.removeWord(msg, args.slice(1).join(" ")); break;
        case "listblacklist": await antispam.listWords(msg); break;

        // Avertissements
        case "warn": await warnings.warnUser(client, msg, msg.mentionedIds[0]); break;
        case "setwarn": await warnings.setSettings(msg, parseInt(args[1]), args[2]); break;

        // Auto-reply
        case "addkeyword": await autoReply.addKeyword(msg, args[1], args.slice(2).join(" ")); break;
        case "removekeyword": await autoReply.removeKeyword(msg, args[1]); break;

        // Top
        case "top": await top.showTop(msg); break;

        // Rappel
        case "remind": await reminder.setReminder(client, msg,
            parseInt(args[1]), parseInt(args[2]), parseInt(args[3]),
            parseInt(args[4]), args.slice(5).join(" ")); break;

        // Liste des commandes
        case "settings": await settings.showSettings(msg); break;

        // Tag tous les membres
        case "tag": await tag.tagAll(client, msg); break;

        // Mute automatique
        case "muted": await muted.muteUser(client, msg, args.slice(1)); break;

        // Message de bienvenue
        case "welcome": await welcome.setWelcome(msg, args.slice(1).join(" ")); break;

        // Supprimer un membre
        case "del": await del.deleteUser(client, msg, msg.mentionedIds[0]); break;

        // Lecture seule
        case "close": await close(client, msg); break;
        case "open": await open(client, msg); break;

        // Permissions
        case "everyone":
        case "admin":
        case "onlyme":
        case "bloc": await permissions.setPermissions(client, msg, args); break;

        default: break;
    }
});

// Lancer le bot
client.initialize();
