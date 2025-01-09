<template>
  <NavBar/>
  <div class="back">
  <div id="admin-match-page">
    <h1>Admin - Manage Matches</h1>

    <div class="match-form">
      <h2>Create New Match</h2>
      <form @submit.prevent="createMatch">
        <div>
          <label for="home_team">Home Team:</label>
          <input type="text" id="home_team" v-model="newMatch.home_team" required />
        </div>
        <div>
          <label for="away_team">Away Team:</label>
          <input type="text" id="away_team" v-model="newMatch.away_team" required />
        </div>
        <div>
          <label for="match_name">Match Name:</label>
          <input type="text" id="match_name" v-model="newMatch.match_name" required />
        </div>
        <div>
          <label for="match_date">Match Date:</label>
          <input type="datetime-local" id="match_date" v-model="newMatch.match_date" required />
        </div>
        <div>
          <label for="odds">Odds:</label>
          <input type="text" id="odds" v-model="newMatch.odds" required />
        </div>
        <button type="submit">Create Match</button>
      </form>
    </div>

    <div class="match-list">
      <h2>Existing Matches</h2>
      <ul>
        <li v-for="match in matches" :key="match._id">
          {{ match.match_name }}: {{ match.home_team }} vs {{ match.away_team }} on {{ formatDate(match.match_date) }}
        </li>
      </ul>
    </div>
  </div>
  </div>
</template>

<script>
import axios from '../../axios';
import NavBar from "@/components/Navbar.vue";

export default {
  name: 'AdminMatch',
  components: {NavBar},
  data() {
    return {
      newMatch: {
        home_team: '',
        away_team: '',
        match_name: '',
        match_date: '',
        odds: '',
      },
      matches: [],
    };
  },
  methods: {
    async fetchMatches() {
      try {
        const response = await axios.get('/api/matches');
        this.matches = response.data;
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    },
    async createMatch() {
      try {
        const response = await axios.post('/api/matches', this.newMatch);
        this.matches.push(response.data);
        this.newMatch = {
          home_team: '',
          away_team: '',
          match_name: '',
          match_date: '',
          odds: '',
        };
      } catch (error) {
        console.error('Error creating match:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  async mounted() {
    await this.fetchMatches();
  },
};
</script>

<style>
#admin-match-page {
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background-color: #0e121a;
  color: #fff;
}

.match-form, .match-list {
  margin-bottom: 20px;
}

.match-form h2, .match-list h2 {
  color: #ffc107;
}

.match-form form div {
  margin-bottom: 10px;
}

.match-form label {
  display: block;
  margin-bottom: 5px;
}

.match-form input {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background-color: #2a2f37;
  color: #fff;
}

.match-form button {
  padding: 10px 20px;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

.match-form button:hover {
  background-color: #218838;
}

.match-list ul {
  list-style: none;
  padding: 0;
}

.match-list li {
  background-color: #242a35;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>