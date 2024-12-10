<template>
  <div id="bet-page" v-if="isLoggedIn">
    <div class="header">
      <h1>Paris Disponibles</h1>
      <p>Solde : {{ this.user.money }} €</p>
    </div>
    <div v-if="newBet.length" :class="{'selected-bets-menu': true, 'open': !isMenuOpen}">
      <h2>Paris Sélectionnés</h2>
      <ul>
        <li v-for="(bet, index) in newBet" :key="index" class="bet-recap-item">
          <div>
            Match : <span class="highlight">{{ bet.homeTeam }} vs {{ bet.awayTeam }}</span> <br />
            Date : {{ formatDate(bet.matchDate) }} <br />
            Pari : <span class="highlight">{{ bet.selectedType }}</span> à {{ bet.selectedOdd }}
          </div>
          <button class="remove-bet-btn" @click="removeBet(index)">❌</button>
        </li>
      </ul>
      <div class="total-odds">
        Cote totale : <span class="highlight">{{ newBet.reduce((acc, bet) => acc * bet.selectedOdd, 1).toFixed(2) }}</span>
      </div>

      <div class="stake-input">
        <label for="stake">Mise (en €) :</label>
        <input
            type="number"
            id="stake"
            v-model.number="stake"
            placeholder="Entrez votre mise"
            min="1"
        />
      </div>

      <div class="total-gains" v-if="stake > 0">
        Gain potentiel : <span class="highlight">{{ (stake * newBet.reduce((acc, bet) => acc * bet.selectedOdd, 1)).toFixed(2) }} €</span>
      </div>

      <button class="place-bet-btn" @click="placeBet" :disabled="!canPlaceBet">
        Miser
      </button>
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
                v-for="(value, type) in { Win: bet.matches[0].odds[0].home, Draw: bet.matches[0].odds[0].draw !== null ? bet.matches[0].odds[0].draw : 0 , Lose: bet.matches[0].odds[0].away }"
                :key="type"
                class="bet-odds-btn"
                @click="selectBet({ type, value, matchId: bet.matches[0]._id })">
              {{ type }}: {{ value }}
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
import NavBar from '../components/Navbar.vue'; // Import du composant NavBar

export default {
  name: 'ShowBet',
  data() {
    return {
      user : [],
      bets: [],
      matches: [],
      teams: [],
      listeBets: [],
      isMenuOpen: false,
      newBet: [],
      stake:0,
      isLoggedIn : localStorage.getItem('isLoggedIn') === 'true',
    };
  },
  computed: {
    uniqueSports() {
      return [...new Set(this.bets.map((bet) => bet.sport[0].name))];
    },
    canPlaceBet() {
      return this.stake > 0 && this.stake <= this.user.money;
    },
  },
  components: {
    NavBar
  },
  methods: {
    async fetchUserBalance() {
      const userId = localStorage.getItem('id');
      const user = await axios.get(`/api/users/${userId}`)
      this.user = user.data;
    },
    async placeBet() {
      if (!this.canPlaceBet) {
        alert("Mise invalide ou solde insuffisant !");
        return;
      }

      try {

        const userId = localStorage.getItem('id');
        const userBetsResponse = await axios.get(`/api/betUser/${userId}`);
        const userBets = userBetsResponse.data;
        const newBetMatchIds = this.newBet.map((bet) => bet.matchId).sort();
        const isDuplicate = userBets.some((existingBet) => {
          const existingBetMatchIds = existingBet.bets.map((bet) => bet.matchId).sort();
          return (
              existingBetMatchIds.length === newBetMatchIds.length &&
              existingBetMatchIds.every((id, index) => id === newBetMatchIds[index])
          );
        });
        if (isDuplicate) {
          alert("Vous avez déjà placé un pari avec les mêmes matchs.");
          return;
        }
        const totalOdds = this.newBet.reduce((acc, bet) => acc * bet.selectedOdd, 1);
        if(totalOdds <= 0){
          alert("Mise invalide ou solde insuffisant !");
          return;
        }
        const betsData = this.newBet.map(bet => ({
          matchId: bet.matchId,
          homeTeam: bet.homeTeam,
          awayTeam: bet.awayTeam,
          selectedType: bet.selectedType,
          selectedOdd: bet.selectedOdd,
        }));
        const payload = {
          userId,
          bets: betsData,
          stake: this.stake,
          totalOdds,
        };
        const response = await axios.post('/api/betUser', payload);
        this.user.money -= this.stake;
        await axios.put(`/api/users/${this.user._id}`, { money: this.user.money });
        alert(`Pari placé avec succès ! Potentiel de gain : ${response.data.potentialGain} €`);
        this.newBet = [];
        this.stake = 0;
      } catch (error) {
        console.error('Erreur lors du placement du pari utilisateur :', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    },
    async fetchMatches() {
      try {
        const response = await axios.get('/api/matches');
        this.matches = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des matches:', error);
      }
    },
    removeBet(index) {
      this.newBet.splice(index, 1);
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
    selectBet(selectedOdd) {
      if (selectedOdd.value === undefined || selectedOdd.value === 'N/A') {
        console.warn('Valeur de cote invalide');
        return;
      }
      const match = this.matches.find((m) => m._id === selectedOdd.matchId);
      if (!match) {
        console.warn('Match introuvable');
        return;
      }
      const existingBetIndex = this.newBet.findIndex(
          (bet) => bet.matchId === selectedOdd.matchId
      );
      if (existingBetIndex !== -1) {
        this.newBet[existingBetIndex].selectedOdd = selectedOdd.value;
        this.newBet[existingBetIndex].selectedType = selectedOdd.type;
      } else {
        this.newBet.push({
          matchId: selectedOdd.matchId,
          homeTeam: this.getTeamNameById(match.home_team),
          awayTeam: this.getTeamNameById(match.away_team),
          matchDate: match.match_date,
          selectedOdd: selectedOdd.value,
          selectedType: selectedOdd.type,
        });
      }
    },

  },
  async mounted() {
    await this.fetchBets();
    await this.fetchMatches();
    await this.fetchTeams();
    await this.fetchUserBalance();
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


.header p {
  margin: 0;
  font-size: 1.2rem;
  color: #ef2128;
  text-align: center;
}

.remove-bet-btn{
  background: none;
}

.remove-bet-btn:hover{
  background : red;
}
.place-bet-btn {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.place-bet-btn:hover {
  background-color: #218838;
}

.place-bet-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
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
  max-width: 60%;
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

.selected-bets-menu h2 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: #ffc107;
}

.selected-bets-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.selected-bets-menu li {
  padding: 5px 0;
  font-size: 1rem;
  border-bottom: 1px solid #2a2f37;
}

.selected-bets-menu li:last-child {
  border-bottom: none;
}
.selected-bets-menu {
  position: fixed;
  right: 20px;
  top: 80px;
  width: 300px;
  background-color: #1c2028;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  color: #fff;
  z-index: 100;
  animation: slideIn 0.3s ease;
}

.selected-bets-menu h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ffc107;
  text-align: center;
}

.selected-bets-menu ul {
  list-style: none;
  padding: 0;
  margin: 0 0 15px;
}

.bet-recap-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #242a35;
  border-radius: 8px;
  transition: transform 0.3s;
}

.bet-recap-item:hover {
  transform: scale(1.03);
}

.highlight {
  color: #ffc107;
  font-weight: bold;
}

.total-odds {
  font-size: 1.2rem;
  margin-bottom: 10px;
  text-align: center;
}

.stake-input {
  margin-bottom: 15px;
  text-align: center;
}

.stake-input label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  color: #adb5bd;
}

.stake-input input {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #2a2f37;
  color: #fff;
}

.total-gains {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 15px;
}

.place-bet-btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.place-bet-btn:hover {
  background-color: #218838;
}

.place-bet-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>