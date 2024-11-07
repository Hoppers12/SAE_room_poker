const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String},
    country: {type: String},
    coach: {type: String},
    sport:{type:String},
})

const Team = mongoose.model('Team', teamSchema);
async function insertDefaultTeams() {
    const count = await Team.countDocuments();
    if (count === 0) {
        const defaultTeams = [
            // Football
            { name: 'Equipe de France', city: 'Paris', country: 'France', coach: 'Didier Deschamps', sport: 'Football' },
            { name: 'OL', city: 'Lyon', country: 'France', coach: 'Pierre Sage', sport: 'Football' },
            { name: 'PSG', city: 'Paris', country: 'France', coach: 'Luis Enrique', sport: 'Football' },
            { name: 'AS Monaco', city: 'Monaco', country: 'Monaco', coach: 'Philippe Clement', sport: 'Football' },
            { name: 'FC Barcelone', city: 'Barcelone', country: 'Espagne', coach: 'Xavi Hernández', sport: 'Football' },
            { name: 'Manchester United', city: 'Manchester', country: 'Angleterre', coach: 'Erik ten Hag', sport: 'Football' },

            // Tennis (Individual Players but treated as "Teams" for structure purposes)
            { name: 'Novak Djokovic', city: 'Belgrade', country: 'Serbie', coach: 'Goran Ivanišević', sport: 'Tennis' },
            { name: 'Rafael Nadal', city: 'Manacor', country: 'Espagne', coach: 'Carlos Moyá', sport: 'Tennis' },
            { name: 'Serena Williams', city: 'Saginaw', country: 'États-Unis', coach: 'Patrick Mouratoglou', sport: 'Tennis' },

            // Rugby
            { name: 'Stade Toulousain', city: 'Toulouse', country: 'France', coach: 'Ugo Mola', sport: 'Rugby' },
            { name: 'Leinster Rugby', city: 'Dublin', country: 'Irlande', coach: 'Leo Cullen', sport: 'Rugby' },
            { name: 'Racing 92', city: 'Paris', country: 'France', coach: 'Laurent Travers', sport: 'Rugby' },

            // Tennis de Table (Individual Players)
            { name: 'Ma Long', city: 'Beijing', country: 'Chine', coach: 'Liu Guoliang', sport: 'Tennis de table' },
            { name: 'Fan Zhendong', city: 'Guangzhou', country: 'Chine', coach: 'Li Sun', sport: 'Tennis de table' },

            // Basketball
            { name: 'Los Angeles Lakers', city: 'Los Angeles', country: 'États-Unis', coach: 'Darvin Ham', sport: 'Basketball' },
            { name: 'Chicago Bulls', city: 'Chicago', country: 'États-Unis', coach: 'Billy Donovan', sport: 'Basketball' },
            { name: 'ASVEL Basket', city: 'Lyon-Villeurbanne', country: 'France', coach: 'TJ Parker', sport: 'Basketball' },

            // Baseball
            { name: 'New York Yankees', city: 'New York', country: 'États-Unis', coach: 'Aaron Boone', sport: 'Baseball' },
            { name: 'Los Angeles Dodgers', city: 'Los Angeles', country: 'États-Unis', coach: 'Dave Roberts', sport: 'Baseball' },
            { name: 'Tokyo Giants', city: 'Tokyo', country: 'Japon', coach: 'Tatsunori Hara', sport: 'Baseball' },

            // Handball
            { name: 'Paris Saint-Germain Handball', city: 'Paris', country: 'France', coach: 'Raúl González', sport: 'Handball' },
            { name: 'FC Barcelone Handball', city: 'Barcelone', country: 'Espagne', coach: 'Carlos Ortega', sport: 'Handball' },

            // Volleyball
            { name: 'Zenit Kazan', city: 'Kazan', country: 'Russie', coach: 'Vladimir Alekno', sport: 'Volleyball' },
            { name: 'VakifBank', city: 'Istanbul', country: 'Turquie', coach: 'Giovanni Guidetti', sport: 'Volleyball' },

            // Athlétisme (Relay Teams)
            { name: 'Team USA 4x100m Hommes', city: 'Divers', country: 'États-Unis', coach: 'Michael Holloway', sport: 'Athlétisme' },
            { name: 'Team Jamaïque 4x100m Femmes', city: 'Divers', country: 'Jamaïque', coach: 'Stephen Francis', sport: 'Athlétisme' },

            // Natation (National Teams)
            { name: 'Équipe de Natation des États-Unis', city: 'Divers', country: 'États-Unis', coach: 'Gregg Troy', sport: 'Natation' },
            { name: 'Équipe de Natation de l\'Australie', city: 'Divers', country: 'Australie', coach: 'Rohan Taylor', sport: 'Natation' }
        ];

        await Team.insertMany(defaultTeams);
        console.log("Les Equipes par défaut ont été insérées !");
    } else {
        console.log("Les Equipes existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultTeams().catch(err => console.error("Erreur lors de l'insertion des Equipes par défaut :", err));



module.exports = Team;