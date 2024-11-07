const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    birthdate: { type: Date },
    city: { type: String },
    nationality: { type: String },
    sport: { type: String },
});

const Player = mongoose.model('Player', playerSchema);

async function insertDefaultTeams() {
    const count = await Player.countDocuments();
    if (count === 0) {
        const defaultTeam = [
            { firstname: 'Pierre', lastname: 'Dupont', birthdate: '1990-04-12', city: 'Paris', nationality: 'Français', sport: 'Football' },
            { firstname: 'Maria', lastname: 'Gomez', birthdate: '1987-03-22', city: 'Madrid', nationality: 'Espagnole', sport: 'Tennis' },
            { firstname: 'Jack', lastname: 'O\'Neill', birthdate: '1995-11-02', city: 'Dublin', nationality: 'Irlandais', sport: 'Rugby' },
            { firstname: 'Wei', lastname: 'Chen', birthdate: '1992-07-15', city: 'Pékin', nationality: 'Chinois', sport: 'Tennis de table' },
            { firstname: 'John', lastname: 'Smith', birthdate: '1998-01-10', city: 'New York', nationality: 'Américain', sport: 'Basketball' },
            { firstname: 'Carlos', lastname: 'Martinez', birthdate: '1989-05-30', city: 'Sao Paulo', nationality: 'Brésilien', sport: 'Baseball' },
            { firstname: 'Hans', lastname: 'Muller', birthdate: '1994-09-17', city: 'Berlin', nationality: 'Allemand', sport: 'Handball' },
            { firstname: 'Anna', lastname: 'Ivanova', birthdate: '1993-12-19', city: 'Moscou', nationality: 'Russe', sport: 'Volleyball' },
            { firstname: 'Yuki', lastname: 'Tanaka', birthdate: '1996-08-03', city: 'Tokyo', nationality: 'Japonais', sport: 'Athlétisme' },
            { firstname: 'Sophie', lastname: 'Dupuis', birthdate: '2000-06-28', city: 'Marseille', nationality: 'Française', sport: 'Natation' },
        ];

        await Player.insertMany(defaultTeam);
        console.log("Les joueurs par défaut ont été insérés !");
    } else {
        console.log("Les joueurs existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultTeams().catch(err => console.error("Erreur lors de l'insertion des joueurs par défaut :", err));

module.exports = Player;
