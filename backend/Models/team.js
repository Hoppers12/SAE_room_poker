const mongoose = require('mongoose');
const Sport = require('./sports');

const teamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String},
    country: {type: String},
    coach: {type: String},
    sport: {type: mongoose.Schema.Types.ObjectId, ref: 'Sport'},
});

const Team = mongoose.model('Team', teamSchema);

async function insertDefaultTeams() {
    const count = await Team.countDocuments();
    if (count === 0) {
        const sports = await Sport.find();
        const sportMap = {};
        sports.forEach(sport => {
            sportMap[sport.name] = sport._id;
        });
        const defaultTeams = [
            { name: 'Equipe de France', city: 'Paris', country: 'France', coach: 'Didier Deschamps', sport: sportMap['Football'] },
            { name: 'OL', city: 'Lyon', country: 'France', coach: 'Pierre Sage', sport: sportMap['Football'] },
            { name: 'PSG', city: 'Paris', country: 'France', coach: 'Luis Enrique', sport: sportMap['Football'] },
            { name: 'AS Monaco', city: 'Monaco', country: 'Monaco', coach: 'Philippe Clement', sport: sportMap['Football'] },
            { name: 'FC Barcelone', city: 'Barcelone', country: 'Espagne', coach: 'Xavi Hernández', sport: sportMap['Football'] },
            { name: 'Manchester United', city: 'Manchester', country: 'Angleterre', coach: 'Erik ten Hag', sport: sportMap['Football'] },
            { name: 'Novak Djokovic', city: 'Belgrade', country: 'Serbie', coach: 'Goran Ivanišević', sport: sportMap['Tennis'] },
            { name: 'Rafael Nadal', city: 'Manacor', country: 'Espagne', coach: 'Carlos Moyá', sport: sportMap['Tennis'] },
            { name: 'Serena Williams', city: 'Saginaw', country: 'États-Unis', coach: 'Patrick Mouratoglou', sport: sportMap['Tennis'] },
            { name: 'Stade Toulousain', city: 'Toulouse', country: 'France', coach: 'Ugo Mola', sport: sportMap['Rugby'] },
            { name: 'Leinster Rugby', city: 'Dublin', country: 'Irlande', coach: 'Leo Cullen', sport: sportMap['Rugby'] },
            { name: 'Racing 92', city: 'Paris', country: 'France', coach: 'Laurent Travers', sport: sportMap['Rugby'] },
            { name: 'Ma Long', city: 'Beijing', country: 'Chine', coach: 'Liu Guoliang', sport: sportMap['Tennis de table'] },
            { name: 'Fan Zhendong', city: 'Guangzhou', country: 'Chine', coach: 'Li Sun', sport: sportMap['Tennis de table'] },
            { name: 'Los Angeles Lakers', city: 'Los Angeles', country: 'États-Unis', coach: 'Darvin Ham', sport: sportMap['Basketball'] },
            { name: 'Chicago Bulls', city: 'Chicago', country: 'États-Unis', coach: 'Billy Donovan', sport: sportMap['Basketball'] },
            { name: 'ASVEL Basket', city: 'Lyon-Villeurbanne', country: 'France', coach: 'TJ Parker', sport: sportMap['Basketball'] },
            { name: 'New York Yankees', city: 'New York', country: 'États-Unis', coach: 'Aaron Boone', sport: sportMap['Baseball'] },
            { name: 'Los Angeles Dodgers', city: 'Los Angeles', country: 'États-Unis', coach: 'Dave Roberts', sport: sportMap['Baseball'] },
            { name: 'Tokyo Giants', city: 'Tokyo', country: 'Japon', coach: 'Tatsunori Hara', sport: sportMap['Baseball'] },
            { name: 'Paris Saint-Germain Handball', city: 'Paris', country: 'France', coach: 'Raúl González', sport: sportMap['Handball'] },
            { name: 'FC Barcelone Handball', city: 'Barcelone', country: 'Espagne', coach: 'Carlos Ortega', sport: sportMap['Handball'] },
            { name: 'Zenit Kazan', city: 'Kazan', country: 'Russie', coach: 'Vladimir Alekno', sport: sportMap['Volleyball'] },
            { name: 'VakifBank', city: 'Istanbul', country: 'Turquie', coach: 'Giovanni Guidetti', sport: sportMap['Volleyball'] },
            { name: 'Team USA 4x100m Hommes', city: 'Divers', country: 'États-Unis', coach: 'Michael Holloway', sport: sportMap['Athlétisme'] },
            { name: 'Team Jamaïque 4x100m Femmes', city: 'Divers', country: 'Jamaïque', coach: 'Stephen Francis', sport: sportMap['Athlétisme'] },
            { name: 'Équipe de Natation des États-Unis', city: 'Divers', country: 'États-Unis', coach: 'Gregg Troy', sport: sportMap['Natation'] },
            { name: 'Équipe de Natation de l\'Australie', city: 'Divers', country: 'Australie', coach: 'Rohan Taylor', sport: sportMap['Natation'] }
        ];
        await Team.insertMany(defaultTeams);
        console.log("Les Equipes par défaut ont été insérées !");
    } else {
        console.log("Les Equipes existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultTeams().catch(err => console.error("Erreur lors de l'insertion des Equipes par défaut :", err));

module.exports = Team;