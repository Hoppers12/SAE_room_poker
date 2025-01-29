<template>
    <div class="lobby">
      <h2 class="title">🎲 Lobby - Sélectionnez une partie</h2>
  
      <!-- Liste des parties existantes -->
      <ul v-if="games.length > 0" class="game-list">
        <li v-for="game in games" :key="game.id" class="game-item">
          <span class="game-name">{{ game.name }}</span>
          <span class="player-count">👥 {{ game.players.length }} joueurs</span>
          <button @click="joinGame(game.id)" class="join-btn">Rejoindre</button>
        </li>
      </ul>
      
      <p v-else class="no-games">Aucune partie disponible...</p>
    </div>
  </template>
  
  <script>
  import { io } from "socket.io-client";
  
  export default {
    data() {
      return {
        socket: null,
        games: [], // Liste des parties préexistantes
      };
    },
    mounted() {
      // Connexion au serveur socket
      this.socket = io("http://localhost:5000");
  
      // Écoute la mise à jour du lobby
      this.socket.on("update-lobby", (games) => {
        this.games = games;
      });
  
      // Récupère les parties existantes au chargement
      this.fetchGames();
    },
    methods: {
      fetchGames() {
        fetch("http://localhost:5000/games")
          .then((res) => res.json())
          .then((data) => {
            this.games = data;
          })
          .catch((err) => console.error("Erreur lors de la récupération des parties :", err));
      },
      joinGame(gameId) {
        this.socket.emit("join-game", gameId);
        this.$router.push(`/game/${gameId}`); // Redirection vers la partie
      },
    },
  };
  </script>
  
  <style scoped>
  .lobby {
    max-width: 600px;
    margin: auto;
    text-align: center;
  }
  
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .game-list {
    list-style: none;
    padding: 0;
  }
  
  .game-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f3f3f3;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  
  .game-name {
    font-weight: bold;
  }
  
  .player-count {
    font-size: 14px;
    color: #555;
  }
  
  .join-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .join-btn:hover {
    background: #45a049;
  }
  
  .no-games {
    color: #888;
  }
  </style>
  