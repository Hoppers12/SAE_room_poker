<template>
  <div class="bet-resume">
    <div class="title">
      <h1>Résumé des paris</h1>
    </div>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="bets.length === 0" class="no-bets">Aucun pari trouvé.</div>
    <div v-else>
      <table class="bet-table">
        <thead>
        <tr>
          <th>Date</th>
          <th>Équipes</th>
          <th>Mise (€)</th>
          <th>Cote totale</th>
          <th>Gain potentiel (€)</th>
          <th>Statut</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bet in bets" :key="bet._id">
          <td>Placé le {{ formatDate(bet.placedAt) }}</td>
          <td>
            <ul>
              <li v-for="match in bet.bets" :key="match._id">
                {{ match.homeTeam }} vs {{ match.awayTeam }} ({{ match.selectedType }} @ {{ match.selectedOdd }})
              </li>
            </ul>
          </td>
          <td>{{ bet.stake }}</td>
          <td>{{ Math.round(bet.totalOdds) }}</td>
          <td>{{ bet.potentialGain }}</td>
          <td class="status" :class="getStatusClass(bet.status)">
            {{ getStatus(bet.status) }}
          </td>
          <td>
            <button
                v-if="bet.status === 'Pending'"
                @click="deleteBet(bet._id)"
                class="delete-btn"
            >
              Supprimer
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "BetResume",
  data() {
    return {
      bets: [],
      loading: true,
    };
  },
  methods: {
    async fetchBets() {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(`/api/betUser/${userId}`);
        this.bets = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des paris :", error);
      } finally {
        this.loading = false;
      }
    },
    async deleteBet(betId) {
      try {
        const stake = this.bets.find((bet) => bet._id === betId).stake;
        const userId = localStorage.getItem("id");
        const user = await axios.get(`/api/users/${userId}`);
        user.data.money += stake;
        await axios.put(`/api/users/${userId}`, user.data);
        await axios.delete(`/api/betUser/${betId}`);
        this.bets = this.bets.filter((bet) => bet._id !== betId);
      } catch (error) {
        console.error("Erreur lors de la suppression du pari :", error);
        alert("Une erreur est survenue lors de la suppression du pari.");
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    getStatus(status) {
      const statusMap = {
        Pending: "En attente",
        Win: "Gagné",
        Lose: "Perdu",
      };
      return statusMap[status] || "Inconnu";
    },
    getStatusClass(status) {
      return {
        Pending: "status-pending",
        Win: "status-win",
        Lose: "status-lose",
      }[status];
    },
  },
  mounted() {
    this.fetchBets();
  },
};
</script>

<style>
.bet-resume {
  padding: 20px;
  background-color: #1b1b1b;
  color: #f4f4f4;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #f4f4f4;
  text-transform: uppercase;
  border-bottom: 3px solid #e63946;
  display: inline-block;
  padding-bottom: 5px;
}

.loading,
.no-bets {
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
}

.bet-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.bet-table th,
.bet-table td {
  padding: 15px;
  text-align: left;
}

.bet-table th {
  background-color: #252525;
  color: #f4f4f4;
}

.bet-table td {
  background-color: #2c2c2c;
  color: #f4f4f4;
}

.bet-table td ul {
  padding-left: 15px;
}

.bet-table td ul li {
  list-style: disc;
}

.delete-btn {
  background-color: #e63946;
  color: #f4f4f4;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}



.delete-btn:hover {
  background-color: #b32737;
}

.status-pending {
  color: #ffa500;
}

.status-win {
  color: #4caf50;
}

.status-lose {
  color: #f44336;
}
</style>
