<template>
  <div class="back">
  <NavBar/>

  <div id="admin-bets">
    <div class="title">
      <h1 style="color: white">Gestion des Paris Sportifs</h1>
    </div>
    <div id="add-bet-form">
      <div class="title">
        <h3>Ajouter un nouveau pari</h3>
      </div>
      <form @submit.prevent="addNewBet">
        <label for="bet_date">Date du Pari (Par défaut aujourd'hui)</label>
        <input type="date" v-model="newBet.bet_date" />
        <label for="bet_expire_date">Date d'Expiration du Pari (Par défaut une semaine)</label>
        <input type="date" v-model="newBet.bet_expire_date" />
        <label for="sport">Sport</label>
        <select v-model="newBet.sport" required>
          <option disabled value="">Sélectionnez un sport</option>
          <option v-for="sport in sports" :key="sport._id" :value="sport._id">
            {{ sport.name }}
          </option>
        </select>
        <div v-if="newBet.sport">
          <label for="team">Equipe</label>
          <select v-model="newBet.team" required>
            <option disabled value="">Sélectionnez l'équipe du pari</option>
            <option v-for="team in filteredTeams(newBet.sport)" :key="team._id" :value="team._id">
              {{ team.name }}
            </option>
          </select>
        </div>
        <div v-if="newBet.team">
          <label for="matches">Match</label>
          <select v-model="newBet.matches" required>
            <option disabled value="">Sélectionnez le match correspondant au pari</option>
            <option v-for="matches in filteredMatches(newBet.team)" :key="matches._id" :value="matches._id">
              {{ matches.match_name }}
            </option>
          </select>
        </div>
        <div v-if="newBet.matches && getOddsForMatch(newBet.matches).length">
          <label for="bet_odds">Cotes</label>
          <select v-model="newBet.bet_odds" required>
            <option disabled value="">Sélectionnez une cote</option>
            <option v-for="(odd, index) in getOddsForMatch(newBet.matches)" :key="index" :value="odd">
              {{ formatOdds(odd) }}
            </option>
          </select>
        </div>


        <button type="submit">Ajouter le pari</button>
      </form>
    </div>

    <table v-if="bets.length">
      <thead>
      <tr>
        <th>Bet ID</th>
        <th>Date du Pari</th>
        <th>Date d'Expiration</th>
        <th>Sport</th>
        <th>Equipe</th>
        <th>Match</th>
        <th>Cotes</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="bet in bets" :key="bet._id">
        <td>{{ bet._id }}</td>
        <td><input type="date" v-model="bet.bet_date" /></td>
        <td><input type="date" v-model="bet.bet_expire_date" /></td>
        <td>
          <select v-model="bet.sport">
            <option v-for="sport in sports" :key="sport._id" :value="sport._id">
              {{ sport.name }}
            </option>
          </select>
        </td>
        <td>
          <select v-model="bet.team">
            <option disabled value="">Sélectionnez une équipe</option>
            <option v-for="team in filteredTeams(bet.sport)" :key="team._id" :value="team._id">
              {{ team.name }}
            </option>
          </select>
        </td>
        <td>
          <select v-model="bet.matches">
            <option disabled value="">Sélectionnez un match</option>
            <option v-for="match in filteredMatches(bet.team)" :key="match._id" :value="match._id">
              {{ match.match_name }}
            </option>
          </select>
        </td>
        <td>
          <select v-if="bet.matches && getOddsForMatch(bet.matches).length" v-model="bet.bet_odds" multiple>
            <option disabled value="">Sélectionnez les côtes</option>
            <option v-for="odd in getOddsForMatch(bet.matches)" :key="odd._id" :value="odd">
              {{ formatOdds(odd) }}
            </option>
          </select>
        </td>

        <td>
          <button @click="updateBet(bet)" class="save-btn">Sauvegarder</button>
          <button @click="deleteBet(bet._id)" class="delete-btn">Supprimer</button>
        </td>
      </tr>
      </tbody>

    </table>
  </div>
</div>
</template>

<script>
import axios from "../../axios";
import NavBar from "@/components/Navbar.vue";

export default {
  name: 'AdminBets',
  components: {NavBar},
  data() {
    return {
      bets: [],
      sports: [],
      teams: [],
      matches:[],
      newBet: {
        bet_date: '',
        bet_expire_date: '',
        sport: '',
        bet_odds: [],
        team: '',
        matches: '',
      }

    };
  },
  computed: {
    filteredTeams() {
      return (sportId) => {
        if (!sportId) return [];
        return this.teams.filter(team => team.sport === sportId);
      };

    },
    filteredMatches() {
      return (teamId) => {
        if (!teamId) return [];
        const now = new Date();
        return this.matches.filter(match =>
            (match.home_team === teamId || match.away_team === teamId) &&
            new Date(match.match_date) > now
        );
      };
    },
  },
  methods: {
    getOddsForMatch(matchId) {
      const match = this.matches.find(m => m._id === matchId);
      return match && match.odds ? match.odds : [];
    },


    formatOdds(odd) {
      return `Home: ${odd.home}, Draw: ${odd.draw}, Away: ${odd.away}`;
    },
    async fetchBets() {
      try {
        const [bets, sports, teams, matches] = await Promise.all([
          axios.get("/api/bets"),
          axios.get("/api/sports"),
          axios.get("/api/teams"),
          axios.get("/api/matches"),
        ]);
        this.bets = bets.data.map(bet => ({
          ...bet,
          bet_date: bet.bet_date ? new Date(bet.bet_date).toISOString().split('T')[0] : '',
          bet_expire_date: bet.bet_expire_date ? new Date(bet.bet_expire_date).toISOString().split('T')[0] : '',
          sport: Array.isArray(bet.sport) ? bet.sport[0]._id : bet.sport._id,
          team: Array.isArray(bet.team) ? bet.team[0]._id : bet.team._id,
          matches: Array.isArray(bet.matches) ? bet.matches[0]._id : bet.matches._id,
          bet_odds: bet.bet_odds || [],
        }));

        this.sports = sports.data;
        this.teams = teams.data;
        this.matches = matches.data;
      } catch (error) {
        console.error("Error fetching bets:", error);
      }
    },

    async updateBet(bet) {
      try {
        await axios.put(`/api/bets/${bet._id}`, bet);
        window.location.reload();
      } catch (error) {
        console.error("Error updating bet:", error);
        alert(`Erreur lors de la mise à jour du pari ${bet._id}`);
      }
    },
    async deleteBet(betId) {
      if (confirm("Voulez-vous vraiment supprimer ce pari ?")) {
        try {
          await axios.delete(`/api/bets/${betId}`);
          this.bets = this.bets.filter(bet => bet._id !== betId);
          window.location.reload();
        } catch (error) {
          console.error("Error deleting bet:", error);
          alert("Erreur lors de la suppression du pari.");
        }
      }
    },
    async addNewBet() {
      try {

        if (!this.newBet.bet_date) {
          this.newBet.bet_date = new Date().toISOString().split('T')[0];
        }
        if (!this.newBet.bet_expire_date) {
          this.newBet.bet_expire_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
        if (this.bets.find(bet => bet.matches === this.newBet.matches)) {
          alert("Ce pari existe déjà");
        }
        else{
          const odds = this.newBet.bet_odds;
          const payload = {
            ...this.newBet,
            bet_odds: odds ? {
              home: odds.home,
              draw: odds.draw,
              away: odds.away,
            } : null,
          };
          const response = await axios.post("/api/bets", payload);
          this.bets.push(response.data);

          this.newBet = {
            bet_date: '',
            bet_expire_date: '',
            sport: '',
            bet_odds: '',
            team: '',
            matches: '',
          };
          window.location.reload();
        }
      } catch (error) {
        console.error("Error adding new bet:", error);
        alert("Erreur lors de l'ajout du pari.");
      }
    },
  },
  mounted() {
    this.fetchBets();
  },
};
</script>

<style>

.title{
  text-align: center;
}

#admin-bets {
  background:#0e121a;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
}

#add-bet-form {
  margin-bottom: 20px;
  background-color: #2a2a40;
  padding: 15px;
  border-radius: 10px;
  color: white;
}

#add-bet-form label {
  display: block;
  margin-bottom: 5px;
}

#add-bet-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f7f8fc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#add-bet-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  color: #000000;
  font-size: 16px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

#add-bet-form select:focus {
  border-color: #4cc8ed;
  outline: none;
  box-shadow: 0 0 5px rgba(76, 200, 237, 0.5);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #b32737;
  color: white;
  font-weight: bold;
}

td input[type="text"], td input[type="date"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 8px 12px;
  background-color: #4cc8ed;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn{
  background-color: #4cc8ed;
  border-radius: 5px;
}
.save-btn:hover{
  background-color: #3aa9d9;
}

.delete-btn {
  background-color: #ff4c4c;
}

.delete-btn:hover {
  background-color: #e03e3e;
}
</style>