const mongoose = require('mongoose');



const oddSchema = new mongoose.Schema({
    odds_type:{type:String},
    odds_value:{type:Number},
});


const Odd = mongoose.model('Odd', oddSchema);

async function insertDefaultOdds() {
    const count = await Odd.countDocuments();
    if (count === 0) {
        const defaultOdds = [
            { odds_type: 'Win', odds_value: 1.65 },
            { odds_type: 'Win', odds_value: 2.98 },
            { odds_type: 'Win', odds_value: 1.5 },
            { odds_type: 'Win', odds_value: 3.67},
            { odds_type: 'Over 2.5 goals', odds_value: 3.75 },
            { odds_type: 'Over 2.5 goals', odds_value: 5.6 },
            { odds_type: 'Over 1.5 goals', odds_value: 2.5 },
        ];
        await Odd.insertMany(defaultOdds);
        console.log("Les côtes par défaut ont été insérées !");
    } else {
        console.log("Les côtes existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultOdds().catch(err => console.error("Erreur lors de l'insertion des côtes par défaut :", err));


module.exports = Odd;
