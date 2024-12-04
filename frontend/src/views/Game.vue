<template>
  <NavBar/>
  <div class="container mt-5" v-if="isLogged">
    <div class="row">
      <div class="col-12 text-center">
      </div>
    </div>
    <div class="row mt-4">
      <PokerTable ref="pokerTableRef" :players="players" :notification="notification"/>
      <button @click="next" class="w-25 h-10">TOUR SUIVANT</button>
      <button @click="nextStreet" class="w-25 h-10">STREET SUIVANTE</button>
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
import PokerTable from "../components/PokerTable.vue";
import { nextTick } from "vue";
import NavBar from '../components/Navbar.vue'; // Import du composant NavBar
export default {
  name: 'GamePlay',
  components: {
    PokerTable,
    NavBar
  },
  data() {
    return {
      isLogged: false,
      notification: '',
      socket: null,
      user: [],
      errorMessage: '',
      players: []
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

      // Attempt to call renderTable() only after confirming the ref is set
      if (this.$refs.pokerTableRef) {
        this.$refs.pokerTableRef.renderTable();
      }
    },
    async begin() {
      this.socket.emit('beginGame');
    },
    async checkStatus() {
      this.isLogged = localStorage.getItem('isLoggedIn') === 'true';
    },
    async next() {
      const players = this.getPlayers()
      const player = players[0]
      console.log('joueur ind0', player)


      this.socket.emit('nextTour');


    },
    async nextStreet() {
      this.socket.emit('nextStreet');
    },
    getPlayers() {
      return this.players
    }
  },
  async mounted() {
    this.checkStatus();
    this.socket = io('http://localhost:5000', { transports: ['websocket'] });

    this.socket.on('connect', () => console.log('Connexion réussie au serveur WebSockect'));
    this.socket.on('connect_error', (err) => console.error('Connection failed:', err));

    this.socket.on('recevoirJoueur', (player, players, pot) => {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      const li = document.createElement('li');
      li.className = 'list-group-item bg-success text-white';
      li.innerText = `${player.name} a rejoint la partie avec ${player.chips} jeton(s)`;
      document.getElementById('chat_connexion').appendChild(li);
      if (this.$refs.pokerTableRef) {
        this.$refs.pokerTableRef.cleanPlayersOverride(ctx, players, pot);
      }
    });

    this.socket.on("updatePot&Stack", (players, pot) => {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      if (this.$refs.pokerTableRef) {
        this.$refs.pokerTableRef.cleanPlayersOverride(ctx, players, pot);
      }

      // on fait la conversion pr transformer la forme de la carte en la premeire lettre en anglais pr 
      // que ça corresponde à l'url de l'API
      const suitMap = {
          'coeur': 'H',   // Hearts
          'carreau': 'D', // Diamonds
          'pique': 'S',   // Spades
          'trèfle': 'C'   // Clubs
      };

      // Pour chaque joueur on va cherche la carte, on la traduit et on l'ajoute dans l'url de l'api
      // Puis on la dessine à côté de lui
      players.forEach(player => {
          var carte1Rank = player.hand[0].rank
          var carte2Rank = player.hand[1].rank
          var carte1Suit = player.hand[0].suit
          var carte2Suit = player.hand[1].suit
          //Si la carte est un 10 on transf en 0 car l'API le veut pr son url 
          if (carte1Rank == '10') {
            carte1Rank = '0' ;
          }
          if (carte2Rank == '10') {
            carte2Rank = '0' ;
          }

          const cardCode1 = `${carte1Rank}${suitMap[carte1Suit]}`;
          const cardCode2 = `${carte2Rank}${suitMap[carte2Suit]}`;
          // On dessine les nouvelles cartes du joueur sur la table
          this.$refs.pokerTableRef.drawCard(player.x+30,player.y+30,cardCode1)
          this.$refs.pokerTableRef.drawCard(player.x+70,player.y+30,cardCode2)
      });


      const li = document.createElement('li');
      li.className = 'list-group-item bg-info text-white';
      li.innerText = `Une blinde a été posée, le pot est maintenant de : ${pot}`;
      document.getElementById('chat_connexion').appendChild(li);
    });

    this.socket.on('updatePositionReelle', (players, pot) => {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      if (this.$refs.pokerTableRef) {
        this.$refs.pokerTableRef.cleanPlayersOverride(ctx, players, pot);
      }
    });

    this.socket.on('quitterJoueur', (player, players, pot) => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-danger text-white';
      li.innerText = `${player.name} a quitté la partie. Il emporte avec lui ${player.chips} jeton(s)`;
      document.getElementById('chat_connexion').appendChild(li);
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      if (this.$refs.pokerTableRef) {
        this.$refs.pokerTableRef.cleanPlayersOverride(ctx, players, pot);
      }
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

    // Wait for next DOM update to confirm refs are set, then call renderTable()
    await nextTick();
    if (this.$refs.pokerTableRef) {
      this.$refs.pokerTableRef.renderTable();
    }
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
