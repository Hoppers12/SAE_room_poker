<template>
  <div id="bet-page">
    <div class="header">
      <h1>Paris Disponibles</h1>
    </div>
    <div v-if="bets.length" class="bet-sections">
      <div class="bet-column" v-for="sport in uniqueSports" :key="sport">
        <h2 class="sport-title">{{ sport }}</h2>
        <div
            v-for="bet in filteredBetsBySport(sport)"
            :key="bet._id"
            class="bet-item"
        >
          <div class="match-info">
            <h3>{{ getTeamNameById(bet.team._id) }} vs {{ getOpponentTeamName(bet) }}</h3>
          </div>
          <p class="bet-dates">
            Début: {{ formatDate(bet.bet_date) }} | Fin: {{ formatDate(bet.bet_expire_date) }}
          </p>
          <div class="bet-odds">
            <button
                v-for="odd in bet.bet_odds"
                :key="odd.odds_type"
                class="bet-odds-btn"
                @click="selectBet(odd)"
            >
              {{ odd.odds_value }}
            </button>
          </div>
        </div>
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
      teams: [],
    };
  },
  computed: {
    uniqueSports() {
      return [...new Set(this.bets.map((bet) => bet.sport[0].name))];
    },
  },
  methods: {
    async fetchMatches() {
      try {
        const response = await axios.get('/api/matches');
        this.matches = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des matches:', error);
      }
    },
    async fetchBets() {
      try {
        const response = await axios.get('/api/bets');
        this.bets = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des paris:', error);
      }
    },
    async fetchTeams() {
      try {
        const response = await axios.get('/api/teams');
        this.teams = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getTeamNameById(teamId) {
      const team = this.teams.find((t) => t._id === teamId);
      return team ? team.name : 'Inconnu';
    },
    getOpponentTeamName(bet) {
      const match = this.matches.find(
          (match) => match._id === bet.matches[0]._id
      );

      if (match) {
        if (match.home_team === bet.team._id) {
          return this.getTeamNameById(match.away_team);
        } else if (match.away_team === bet.team._id) {
          return this.getTeamNameById(match.home_team);
        }
      }
      return 'Inconnu';
    },
    filteredBetsBySport(sport) {
      return this.bets.filter((bet) => bet.sport[0].name === sport);
    },
    selectBet(odd) {
      console.log('Cote sélectionnée :', odd);
      // Ajoutez ici l'action à effectuer lors du clic sur une cote
    },
  },
  async mounted() {
    await this.fetchBets();
    await this.fetchMatches();
    await this.fetchTeams();
  },
};
</script>


<style>
#bet-page {
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background-color: #0e121a;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffc107;
  font-size: 2rem;
}

.bet-sections {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
}

.bet-column {
  width: 350px;
  background-color: #1c2028;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.sport-title {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #ffc107;
}

.bet-item {
  background-color: #242a35;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.bet-item:hover {
  transform: scale(1.03);
}

.match-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
}

.bet-dates {
  font-size: 0.9rem;
  color: #adb5bd;
}

.bet-odds {
  display: flex;
  justify-content: space-evenly;
  margin-top: 10px;
}

.bet-odds-btn {
  background-color: #ffc107;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 1rem;
  color: #1c2028;
  cursor: pointer;
  transition: background-color 0.3s;
}

.bet-odds-btn:hover {
  background-color: #e0a800;
}

</style>