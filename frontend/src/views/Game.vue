<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 text-center">
      </div>
    </div>
    <div class="row mt-4">
      <PokerTable ref="pokerTableRef" :players="players" :notification="notification"/>
        <button @click="begin" class="w-25 h-10">SUIVANT</button>
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
</template>

<script>
import { io } from "socket.io-client";
import axios from "../axios";
//Composant qui gère tout ce qui est en rapport avec la table de jeu
import PokerTable from "../components/PokerTable.vue"

export default {
  name: 'GamePlay',
  components : {
    PokerTable
  },
  data() {
    return {
      notification: '',
      socket: null,
      user: [],
      errorMessage: '',
      players:[]
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

      //Appelle la méthode renderTable qui est dans le composant pokerTableRef
      this.$refs.pokerTableRef.renderTable();
    },
    //Methode qui débute la partie
    async begin() {
      this.socket.emit('beginGame')

    },
    //Methode qui retourne la liste de tous les joueurs actuellement dans la partie
    getPlayers()
    {
      return this.getPlayers()
    }
  },
  mounted() {
    this.socket = io('http://localhost:5000', { transports: ['websocket'] });

    this.socket.on('connect', () => console.log('Connexion réussie au serveur WebSocket'));
    this.socket.on('connect_error', (err) => console.error('Connection failed:', err));

    //Socket qui gère l'ajout d'un nouveau joueur
    this.socket.on('recevoirJoueur', (player,players,pot) =>
    {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');

      //On crée la notif lorsque un nouveau joueur rejoint
      const li = document.createElement('li');
      li.className = 'list-group-item bg-success text-white';
      li.innerText = `${player.name} a rejoint la partie avec ${player.chips} jeton(s)`;
      document.getElementById('chat_connexion').appendChild(li);

      this.$refs.pokerTableRef.cleanPlayersOverride(ctx,players,pot) ;


    });

    //Met à jour l'affichage avec la nouvelle valeur du pot et des stacks
    this.socket.on("updatePot&Stack",(players,pot)=>
    {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      this.$refs.pokerTableRef.cleanPlayersOverride(ctx,players,pot);

      //On crée la notif lorsque un joueur pose les blindes
      const li = document.createElement('li');
      li.className = 'list-group-item bg-info text-white';
      li.innerText = `Une blinde a été posée, le pot est maintenant de : ${pot}`;
      document.getElementById('chat_connexion').appendChild(li);

    })

    this.socket.on('quitterJoueur', (player,players,pot) => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-danger text-white';
      li.innerText = `${player.name} a quitté la partie. Il emporte avec lui ${player.chips} jeton(s)`;
      document.getElementById('chat_connexion').appendChild(li);

      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      this.$refs.pokerTableRef.cleanPlayersOverride(ctx,players,pot) ;
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

    this.$refs.pokerTableRef.renderTable();
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
