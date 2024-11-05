const mongoose = require('mongoose');


const sportSchema = new mongoose.Schema({
    name:{type:String},
});

const Sport = mongoose.model('Sport', sportSchema);
async function insertDefaultSports() {
    const count = await Sport.countDocuments();
    if (count === 0) {
        const defaultSports = [
            { name: 'Football'},
            { name: 'Tennis'},
            { name: 'Rugby'},
            { name: 'Tennis de table'},
            { name: 'Basketball'},
            { name: 'Baseball'},
            { name: 'Handball'},
            { name: 'Volleyball'},
            { name: 'Athlétisme'},
            { name: 'Natation'},
        ];
        await Sport.insertMany(defaultSports);
        console.log("Les sports par défaut ont été insérées !");
    } else {
        console.log("Les sports existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultSports().catch(err => console.error("Erreur lors de l'insertion des sports par défaut :", err));


module.exports = Sport;
