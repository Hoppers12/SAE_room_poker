const mongoose = require('mongoose');
const Team = require('./team');
const Sport = require('./sports');
const Bet = require('./bet');
const matchSchema = new mongoose.Schema({
    home_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    away_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    match_name: { type: String, default: null },
    result: { type: String, default: null },
    id_sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport' },
    match_date: { type: Date, default: Date.now },
    odds: [{home : {type: Number}, draw : {type: Number}, away : {type: Number}}],

});

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);

async function insertDefaultMatches() {
    const count = await Match.countDocuments();
    if (count === 0) {
        const teams = await Team.find();
        const sports = await Sport.find();
        const teamMap = {};
        const sportMap = {};
        teams.forEach(team => {
            teamMap[team.name] = team._id;
        });
        sports.forEach(sport => {
            sportMap[sport.name] = sport._id;
        });
        const defaultMatches = [
            {
                home_team: teamMap['PSG'],
                away_team: teamMap['OL'],
                match_name: 'PSG-OL',
                result: null,
                id_sport: sportMap['Football'],
                match_date: new Date('2025-10-01'),
                odds: [{ home: 1.8, draw: 3.5, away: 4.0 }]
            },
            {
                home_team: teamMap['PSG'],
                away_team: teamMap['OL'],
                match_name: 'PSG-OL',
                result: null,
                id_sport: sportMap['Football'],
                match_date: new Date('2024-10-12'),
                odds: [{ home: 1.8, draw: 3.5, away: 4.0 }]
            },
            {
                home_team: teamMap['PSG'],
                away_team: teamMap['OL'],
                match_name: 'PSG-OL(test)',
                result: null,
                id_sport: sportMap['Football'],
                match_date: new Date('2024-01-01'),
                odds: [{ home: 1.9, draw: 3.2, away: 3.8 }]
            },
            {
                home_team: teamMap['FC Barcelone'],
                away_team: teamMap['Manchester United'],
                match_name: 'Barça-Manchester',
                result: null,
                id_sport: sportMap['Football'],
                match_date: new Date('2024-10-02'),
                odds: [{ home: 2.1, draw: 3.1, away: 3.6 }]
            },
            {
                home_team: teamMap['Novak Djokovic'],
                away_team: teamMap['Rafael Nadal'],
                match_name: 'Novak-Nadal',
                result: null,
                id_sport: sportMap['Tennis'],
                match_date: new Date('2025-10-03'),
                odds: [{ home: 1.7, draw: null, away: 2.2 }]
            },
            {
                home_team: teamMap['Stade Toulousain'],
                away_team: teamMap['Leinster Rugby'],
                match_name: 'Stade toulousain-Leinster',
                result: null,
                id_sport: sportMap['Rugby'],
                match_date: new Date('2025-10-04'),
                odds: [{ home: 2.3, draw: 3.5, away: 2.9 }]
            },
            {
                home_team: teamMap['Los Angeles Lakers'],
                away_team: teamMap['Chicago Bulls'],
                match_name: 'Lakers-Bulls',
                result: null,
                id_sport: sportMap['Basketball'],
                match_date: new Date('2025-10-05'),
                odds: [{ home: 1.5, draw: null, away: 2.7 }]
            },
            {
                home_team: teamMap['FC Barcelone Handball'],
                away_team: teamMap['Paris Saint-Germain Handball'],
                match_name: 'Barça-PSG',
                result: null,
                id_sport: sportMap['Handball'],
                match_date: new Date('2025-01-01'),
            }
        ];
        await Match.insertMany(defaultMatches);
        console.log("Les matchs par défaut ont été insérés !");
    } else {
        console.log("Les matchs existent déjà, aucune insertion n'est nécessaire.");
    }
}

insertDefaultMatches().catch(err => console.error("Erreur lors de l'insertion des matchs par défaut :", err));

module.exports = Match;