<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 text-center">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-8 d-flex justify-content-center">
        <div class="bloc_canva position-relative">
          <canvas id="pokerTable" width="800" height="600" class="border border-light rounded"></canvas>
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
import axios from "../axios";

export default {
  name: 'GamePlay',
  data() {
    return {
      notification: '',
      socket: null,
      user: [],
      errorMessage: ''
    };
  },
  methods: {
    async send() {
      try {
        const id = localStorage.getItem('id');
        const userData = await axios.get(`/api/users/${id}`);
        this.user = userData.data;
        this.socket.emit('joinGame', this.user.pseudo);
      } catch (e) {
        this.errorMessage = "Vous devez être connecté pour rejoindre";
      }

      this.startDrawing();
    },
    drawPokerTable(ctx, canvas) {
      ctx.fillStyle = "#006400";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 350, 200, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
    drawPlayer(ctx, player,x=0, y=0) {
      ctx.beginPath();
      console.log(player);
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillText(this.givePosition(player.p_reelle), x - 15, y - 5);
      ctx.fillText(player.name, x - 15, y + 5);
      ctx.fillText(player.chips + ' jetons', x - 25, y + 50);
      ctx.stroke();

    },
    // Traduit l'indice de la position en son nom réel (0 = BTN, etc ...)
    givePosition(indexPosition) {
      switch (indexPosition) {
        case 0:
          return 'BTN'
        case 1:
          return 'SB'
        case 2 :
          return 'BB'
        case 3 :
          return 'HJ'
        case 4 :
          return 'LJ'
        case 5:
          return 'CO'
        default :
          return 'Inconnue'
      }
    },
    //Methode qui retourne la liste de tous les joueurs actuellement dans la partie
    getPlayers()
    {
      return this.getPlayers()
    },
    startDrawing()
    {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');

      this.drawPokerTable(ctx, canvas);

    },
    cleanPlayers(ctx,players) {
      // Efface tout le contenu du canevas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Redessine la table
      this.drawPokerTable(ctx, ctx.canvas);

      console.log('ICI : ',players);
      if (players.length>0) {
        // Redessine tous les joueurs sauf celui à effacer
        players.forEach((player) => {

          this.drawPlayer(ctx, player, player.x, player.y);
        });
      }

    }
  },
  mounted() {
    this.socket = io('http://localhost:5000', { transports: ['websocket'] });

    this.socket.on('connect', () => console.log('Connexion réussie au serveur WebSocket'));
    this.socket.on('connect_error', (err) => console.error('Connection failed:', err));

    //Socket qui gère l'ajout d'un nouveau joueur
    this.socket.on('recevoirJoueur', (player,players) =>
    {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');

      //On crée la notif lorsque un nouveau joueur rejoint
      const li = document.createElement('li');
      li.className = 'list-group-item bg-success text-white';
      li.innerText = `${player.name} a rejoint la partie avec ${player.chips} jeton(s)`;
      document.getElementById('chat_connexion').appendChild(li);

      this.cleanPlayers(ctx,players) ;


    });

    this.socket.on('quitterJoueur', (player,players) => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-danger text-white';
      li.innerText = `${player.name} a quitté la partie. Il emporte avec lui ${player.chips} jeton(s)`;
      document.getElementById('chat_connexion').appendChild(li);

      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      this.cleanPlayers(ctx,players) ;
    });

    this.socket.on('listeJoueursPartie', (user_list) => {
      const listeJoueurs = document.getElementById('liste_joueurs');
      listeJoueurs.innerHTML = '';
      user_list.forEach(player => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-white';
        li.innerText = player.name;
        listeJoueurs.appendChild(li);
      });
    });

    this.startDrawing();
  }
};
</script>

<style scoped>
h1 {
  color: #28a745;
}
#chat_connexion {
  max-height: 100px;
  overflow: auto;
}
canvas {
  border: 2px solid #28a745;
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
  color: red;
}
</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
