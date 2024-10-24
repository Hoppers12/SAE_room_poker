<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 text-center">

      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-8 d-flex justify-content-center">
        <div class="bloc_canva position-relative">
          <canvas id="pokerTable" width="800" height="500" class="border border-light rounded"></canvas>
          <div class="position-absolute top-50 start-50 translate-middle text-white fw-bold" v-if="notification">
            {{ notification }}
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="mb-3">
          <h2 class="h4 text-light">Connexion</h2>
          <ul id="chat_connexion" class="list-group bg-secondary text-white border-light"></ul>
        </div>

        <div class="mb-3">
          <button @click="send" class="btn btn-primary mt-2 w-100">Rejoindre la partie</button>
          <p v-if="errorMessage" class="error">{{errorMessage}}</p>
        </div>

        <div>
          <h2 class="h4 text-light">Liste des joueurs présents</h2>
          <ul id="liste_joueurs" class="list-group bg-secondary text-white border-light"></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

import axios from "../axios"
export default {
  name: 'GamePlay',
  data() {
    return {
      notification: '',
      socket: null,
      user:[],
      errorMessage : ''
    };
  },
  methods: {
    async send() {
      // L'utilisateur est connecté
      try {
        const id = localStorage.getItem('id')
        const userData = await axios.get(`/api/users/${id}`)
        this.user = userData.data
        this.socket.emit('joinGame', this.user.pseudo);

      }
      //L'utilisateur n'est pas connecté
      catch (e)
      {
        this.errorMessage = "Vous devez être connecté pour rejoindre"
      }


    }
  },
  mounted() {
    const {getPlayers} = require('../../../socketHandler');
    const canvas = document.getElementById('pokerTable');
    const ctx = canvas.getContext('2d');

    this.socket = io('http:/' +
        '/localhost:5000', {
      transports: ['websocket'],
    });
    this.socket.on('connect', function() {
      console.log('Connexion réussie au serveur WebSocket');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Connection failed:', err);
    });

    var receive_user = function(player) {
      var li = document.createElement('li');
      li.className = 'list-group-item bg-success text-white';
      li.innerText = player.name + ' a rejoint la partie avec ' + player.chips + ' jeton(s)';
      document.getElementById('chat_connexion').appendChild(li);
    };

    var leave_user = function(player) {
      var li = document.createElement('li');
      li.className = 'list-group-item bg-danger text-white';
      li.innerText = player.name + ' a quitté la partie. Il emporte avec lui ' + player.chips + ' jeton(s)';
      document.getElementById('chat_connexion').appendChild(li);
    };

    var print_user_list = function(user_list) {
      var listeJoueurs = document.getElementById('liste_joueurs');
      listeJoueurs.innerHTML = '';

      user_list.forEach(function(player) {
        var li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-white';
        li.innerText = player.name;
        listeJoueurs.appendChild(li);
      });
    };

    this.socket.on('recevoirJoueur', receive_user);
    this.socket.on('quitterJoueur', leave_user);
    this.socket.on('listeJoueursPartie', print_user_list);

    function drawPokerTable() {
      ctx.fillStyle = "#006400";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 10;

      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 350, 200, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

    }

    function draw() {
      drawPokerTable();

      var players = getPlayers() ;
      // Dessiner les joueurs autour de la table
      players.forEach(player => {
        drawPlayer(player);
      });
    }

    function drawPlayer(player) {
      ctx.beginPath();
      ctx.arc(player.x, player.y, 30, 0, Math.PI * 2);  // Dessiner un cercle pour représenter un joueur
      ctx.fillText(player.name, player.x - 15, player.y + 5);  // Nom du joueur
      ctx.stroke();
    }


    const test = localStorage.getItem('id');
    console.log(test);
    draw();

    module.exports = {
      draw
    };

  }
};


</script>

<style scoped>


h1 {
  color: #28a745; /* Vert poker */
}

#chat_connexion {
  max-height:100px;
  overflow:auto;
}

canvas {
  border: 2px solid #28a745; /* Vert foncé pour la bordure */
}

.bloc_canva {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-white {
  color: #fff;
}

.bg-dark {
  background-color: #343a40 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

.error {
  color:red;
}
</style>

<!-- Intégration de Bootstrap -->
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
/>
