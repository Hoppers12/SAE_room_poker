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
  import axios from "../axios";
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
            console.log("games : " , this.games)
          })
          .catch((err) => console.error("Erreur lors de la récupération des parties :", err));

      },
      async joinGame(gameId) {

        try {
        const id = await this.getLocalPlayerId()
        const userData = await axios.get(`/api/users/${id}`)
        this.user = userData.data;
        //Verification de si le joueur a assez de jetons pour rejoindre (1000)
        if (this.user.money >= 1000) {
      
          //Requête PUT pour modifier l'argent sur le compte
          await axios.put(`/api/users/${id}`, {
            money: this.user.money - 1000
          });
            console.log("game id : " , gameId)
            this.socket.emit('joinGame', this.user,id,gameId);
            this.$refs.navbar.editMoney()
            this.closeModalJoin(); // Ferme la modale après avoir rejoint la partie
        }else {
          console.log("Vous n'avez pas assez de jetons pour rejoindre cette partie (1000)")
          const li = document.createElement('li');
          li.className = 'list-group-item bg-danger text-white';
          li.innerText = `Vous n'avez pas assez de jetons pour rejoindre (1000 nécessaires)`;
          document.getElementById('chat_connexion').appendChild(li);
        }
        } catch (e) {
            this.errorMessage = "Vous devez être connecté pour rejoindre";
          }

          // Attempt to call renderTable() only after confirming the ref is set
          if (this.$refs.pokerTableRef) {
            this.$refs.pokerTableRef.renderTable();
          }
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
  