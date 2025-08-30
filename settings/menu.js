module.exports = {
    showSettings: async (msg) => {
        const settingsText = `
📋 *Fonctionnalités du bot et commandes*

1️⃣ *Tag tous les membres*  
- Commande : \`tag\`  
- Fonction : Mentionne tous les membres du groupe et liste leur nom, vérifie que l’auteur est admin.

2️⃣ *Mute automatique*  
- Commande : \`muted @user <jour-mois heure:minutes>\`  
- Fonction : Supprime automatiquement les messages d’un membre jusqu’à la date/heure définie.

3️⃣ *Message de bienvenue*  
- Commande : \`welcome <texte>\`  
- Fonction : Définit un message de bienvenue envoyé à chaque nouveau membre. Mention automatique du membre.

4️⃣ *Supprimer un membre*  
- Commande : \`del @user\`  
- Fonction : Supprime un membre du groupe. Seuls les admins peuvent utiliser cette commande.

5️⃣ *Permissions du bot*  
- Commandes : \`everyone\`, \`admin\`, \`onlyme\`, \`bloc <numéro>\`  
- Fonction : Contrôle qui peut utiliser les commandes du bot (tout le monde, admin, propriétaire, ou bloquer un utilisateur).

6️⃣ *Lecture seule*  
- Commandes : \`close\` / \`open\`  
- Fonction : Empêche ou autorise les membres à envoyer des messages (seuls les admins peuvent écrire).

7️⃣ *Anti-spam / Blacklist*  
- Commandes : \`addblacklist <mot>\`, \`removeblacklist <mot>\`, \`listblacklist\`  
- Fonction : Supprime automatiquement les messages contenant des mots interdits. Les admins peuvent gérer la liste.

8️⃣ *Avertissements et sanctions*  
- Commandes : \`warn @user\`, \`setwarn <nombre> <mute|ban>\`  
- Fonction : Donne des avertissements et applique automatiquement une sanction après un nombre défini d’avertissements.

9️⃣ *Réponses automatiques (FAQ)*  
- Commandes : \`addkeyword <mot> <réponse>\`, \`removekeyword <mot>\`  
- Fonction : Le bot répond automatiquement aux mots clés définis par les admins.

🔟 *Top des contributions*  
- Commande : \`top\`  
- Fonction : Affiche le top 10 des membres les plus actifs (messages, stickers, photos, audios, etc.).

1️⃣1️⃣ *Rappel programmé*  
- Commande : \`remind <jour> <heure> <minute> <nombre de fois> <texte>\`  
- Fonction : Envoie un rappel programmé dans le groupe, défini par un admin.

---

Envoyez \`settings\` pour voir cette liste à tout moment.
        `;
        msg.reply(settingsText);
    }
};
