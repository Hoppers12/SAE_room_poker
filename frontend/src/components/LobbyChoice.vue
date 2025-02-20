<template>
  <div class="back">
    <Navbar  ref="navbar"/>
    <div class="lobby">
      <h2 class="title">🎲 LOBBY - Sélectionnez une partie</h2>
  
      <!-- Liste des parties existantes -->
      <ul v-if="games.length > 0" class="game-list">
        <li v-for="game in games" :key="game.id" class="game-item">
          <span class="game-name">PARTIE : {{ game.id }}</span>
          <span  class="player-count">👥 {{ game.players.length }} joueurs</span>
          <button @click="joinGame(game.id)" class="join-btn">Rejoindre</button>
        </li>
      </ul>
      
      <p v-else class="no-games">Aucune partie disponible...</p>
    </div>
  </div>
  </template>
  
  <script>
  import { io } from "socket.io-client";
  import axios from "../axios";
  import Navbar from "./Navbar.vue";

  export default {
  name: 'LobbyChoice',
  components: {
    Navbar
  },
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
        //On récupère toutes les parties existantes
      fetchGames() {
        fetch("http://localhost:5000/api/games")
          .then((res) => res.json())
          .then((data) => {
            this.games = data;
            console.log("games : " , this.games)
          })
          .catch((err) => console.error("Erreur lors de la récupération des parties :", err));

      },
          //Obtenir son id local du joueur connecté actuellement
    async getLocalPlayerId() {
      return localStorage.getItem('id');
    },

      async joinGame(gameId) {

        //Récupérer le joueur qui veut rejoindre
        const id = await this.getLocalPlayerId()
        console.log("id : " ,id)
        const userData = await axios.get(`http://localhost:3000/api/users/${id}`);
        this.user = userData.data;
        console.log("user data :",this.user)

        console.log("game id : " , gameId   )

      
        // Mettre à jour la partie avec le joueur ajouté
        axios.patch(`http://localhost:5000/api/games/${gameId}/players`, {
          players: [
            this.user
          ]
        })
        .then(response => {
            console.log("Partie mise à jour :", response.data);
        })
        .catch(error => {
            console.error("Erreur :", error);
        });

        console.log("Joueur ajouté avec succès !");
      //  await axios.delete(`http://localhost:5000/api/games/${gameId}/players`);
        this.$router.push(`/game${gameId}`);
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
    color:white;
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

  .back {
    background-image: url(../img/background.png);
    background-repeat: no-repeat;
    background-size: 100vw, 100vh;
    position: fixed;
    z-index: 0; /* Gardez-le derrière le contenu */
    width: 100vw;
    height: 100vh;
    top: 0;
    display:flex;
    flex-direction: column;
    justify-content: center;
  }
  </style>
  