const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    message:{type:String},
    notification_type: { type: String},
    is_read:{type:Boolean, default: false},
});

const Notifications = mongoose.model('Notifications', notificationSchema);

async function insertDefaultNotifications() {
    const count = await Notifications.countDocuments();
    if (count === 0) {
        const defaultNotifications = [
            { message: 'Votre pari a bien été placé', notification_type: 'Bet Placed' },
            { message: 'Félicitations, vous avez gagné votre pari !', notification_type: 'Win' },
            { message: 'Désolé, vous avez perdu votre pari !', notification_type: 'Lose' },
        ];
        await Notifications.insertMany(defaultNotifications);
        console.log("Les notifications par défaut ont été insérées !");
    } else {
        console.log("Les notifications existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultNotifications().catch(err => console.error("Erreur lors de l'insertion des notifications par défaut :", err));




module.exports = Notifications;
