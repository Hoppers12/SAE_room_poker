const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String},
    country: {type: String},
    coach: {type: String},
})

const Team = mongoose.model('Team', teamSchema);
async function insertDefaultTeams() {
    const count = await Team.countDocuments();
    if (count === 0) {
        const defaultTeams = [
            { name: 'Equipe de France', city: 'Paris',country: 'France',coach:'Didier Deschamps' },
            { name: 'OL', city: 'Lyon',country: 'France',coach:'Pierre Sage' },
            { name: 'PSG', city: 'Paris',country: 'France',coach:'Luis Enrique' },
            { name: 'AS Monaco', city: 'Monaco',country: 'Monaco',coach:'Philippe Clement'},
            { name: 'Stade Toulousain', city: 'Toulouse',country: 'France',coach:'Ugo Mola' },
            { name: 'Rugby Club de France', city: 'Paris',country: 'France',coach:'Thomas Savare' },
            { name: 'Fc Barcelone', city: 'Barcelone',country: 'Espagne',coach:'Hansi Flick' },
            { name: 'Manchester United', city: 'Manchester',country: 'Angleterre',coach:'Erik ten Hag' },
            { name: 'Juventus', city: 'Turin',country: 'Italie',coach:'Massimiliano Allegri' },
            { name: 'Bayern Munich', city: 'Munich',country: 'Allemagne',coach:'Vincent Kompany' },
        ];
        await Team.insertMany(defaultTeams);
        console.log("Les Equipes par défaut ont été insérées !");
    } else {
        console.log("Les Equipes existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultTeams().catch(err => console.error("Erreur lors de l'insertion des côtes par défaut :", err));



module.exports = Team;