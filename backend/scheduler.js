const cron = require('node-cron');
const Match = require('./models/Match');


async function updateMatchResults() {
    try {
        const now = new Date();
        const matches = await Match.find({match_date:{$lt:now},result:null});
        for (const match of matches) {
            const results = ['win', 'draw', 'lose'];
            match.result = results[Math.floor(Math.random()*results.length)];
            await (await match).save();
        }
    } catch (error) {
        console.error('Error updating match results:',error);
    }
}
cron.schedule('* * * * *', updateMatchResults);