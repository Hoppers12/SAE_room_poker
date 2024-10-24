<template>
  <div id="admin-bets">
    <h1 style="color: white">Gestion des Paris Sportifs</h1>
    <div id="add-bet-form">
      <h3>Ajouter un nouveau pari</h3>
      <form @submit.prevent="addNewBet">
        <label for="amount">Montant</label>
        <input type="text" v-model="newBet.amount" required />

        <label for="bet_type">Type de Pari</label>
        <input type="text" v-model="newBet.bet_type" required />

        <label for="bet_date">Date du Pari</label>
        <input type="date" v-model="newBet.bet_date" required />

        <label for="bet_result">Résultat</label>
        <input type="text" v-model="newBet.bet_result" required />

        <label for="sport">Sport</label>
        <input type="text" v-model="newBet.sport" required />

        <button type="submit">Ajouter le pari</button>
      </form>
    </div>

    <table>
      <thead>
      <tr>
        <th>Bet ID</th>
        <th>Montant</th>
        <th>Type de Pari</th>
        <th>Date du Pari</th>
        <th>Résultat</th>
        <th>Sport</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="bet in bets" :key="bet._id">
        <td>{{ bet._id }}</td>
        <td><input type="text" v-model="bet.amount" /></td>
        <td><input type="text" v-model="bet.bet_type" /></td>
        <td><input type="date" v-model="bet.bet_date" /></td>
        <td><input type="text" v-model="bet.bet_result" /></td>
        <td><input type="text" v-model="bet.sport" /></td>
        <td>
          <button @click="updateBet(bet)">Sauvegarder</button>
          <button @click="deleteBet(bet._id)" class="delete-btn">Supprimer</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "../../axios";

export default {
  name: 'AdminBets',
  data() {
    return {
      bets: [],
      newBet: {
        amount: '',
        bet_type: '',
        bet_date: '',
        bet_result: '',
        sport: '',
      }
    };
  },
  methods: {
    async fetchBets() {
      try {
        const response = await axios.get("/api/bets");
        this.bets = response.data;
      } catch (error) {
        console.error("Error fetching bets:", error);
      }
    },
    async updateBet(bet) {
      try {
        await axios.put(`/api/bets/${bet._id}`, bet);
        alert(`Le pari ${bet._id} a été mis à jour avec succès!`);
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
          alert("Pari supprimé avec succès.");
        } catch (error) {
          console.error("Error deleting bet:", error);
          alert("Erreur lors de la suppression du pari.");
        }
      }
    },
    async addNewBet() {
      try {
        const response = await axios.post("/api/bets", this.newBet);
        this.bets.push(response.data);
        this.newBet = {
          amount: '',
          bet_type: '',
          bet_date: '',
          bet_result: '',
          sport: ''
        };
        alert("Nouveau pari ajouté avec succès!");
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
#admin-bets {
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

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #8b3a62;
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
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa9d9;
}

.delete-btn {
  background-color: #ff4c4c;
}

.delete-btn:hover {
  background-color: #e03e3e;
}
</style>
