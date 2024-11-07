const mongoose = require('mongoose');



const oddSchema = new mongoose.Schema({
    odds_type: {type: String},
    odds_value:{type:Number},
    odds_team :{type:mongoose.Schema.Types.ObjectId, ref:'Team'},
});


const Odd = mongoose.model('Odd', oddSchema);


async function insertDefaultOdds() {
    const count = await Odd.countDocuments();
    if (count !== 0) {
        const defaultOdds = [
            { odds_type: 'Win', odds_value: 3.75 },
            { odds_type: 'Win', odds_value: 3.75 },
            { odds_type: 'Win', odds_value: 3.75 },
        ];
        await Odd.insertMany(defaultOdds);
        console.log("Les notifications par défaut ont été insérées !");
    } else {
        console.log("Les notifications existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultOdds().catch(err => console.error("Erreur lors de l'insertion des côtes par défaut :", err));


module.exports = Odd;
