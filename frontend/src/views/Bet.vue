<template>
  <div id="bet-page">
    <h1>Paris Disponibles</h1>
    <div v-if="bets.length">
      <div v-for="bet in bets" :key="bet._id" class="bet-item">
        <h2>{{ bet.team.name }} vs {{ getOpponentTeamName(bet) }}</h2>
        <p>Date du Pari: {{ formatDate(bet.bet_date) }}</p>
        <p>Date d'Expiration: {{ formatDate(bet.bet_expire_date) }}</p>
        <p>Sport: {{ bet.sport.name }}</p>
        <p>Match: {{ getMatchName(bet.matches) }}</p>
        <p>Cotes: {{ getOddsDescription(bet.bet_odds) }}</p>
      </div>
    </div>
    <div v-else>
      <p>Aucun pari disponible pour le moment.</p>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'ShowBet',
  data() {
    return {
      bets: [],
      matches: [],
    };
  },
  methods: {
    async fetchBets() {
      try {
        const response = await axios.get('/api/bets');
        this.bets = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des paris:', error);
      }
    },
    async fetchMatches() {
      try {
        const response = await axios.get('/api/matches');
        this.matches = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getOpponentTeamName(bet) {
      const match = this.matches.find(m => m._id === bet.matches._id);
      if (match) {
        return match.home_team === bet.team ? match.away_team.name : match.home_team.name;
      }
      return 'Inconnu';
    },
    getMatchName(matchId) {
      const match = this.matches.find(m => m._id === matchId);
      return match ? match.match_name : 'Inconnu';
    },
    getOddsDescription(odds) {
      return odds.map(odd => `${odd.odds_value} - ${odd.odds_type}`).join(', ');
    },
  },
  async mounted() {
    await this.fetchMatches();
    await this.fetchBets();
  },
};
</script>

<style>
#bet-page {
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.bet-item {
  background-color: #f7f8fc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.bet-item h2 {
  margin-top: 0;
}

.bet-item p {
  margin: 5px 0;
}
</style>