<template>
  <NavBar/>
  <div class="back">
    <div class="container mt-5" v-if="isLogged">
    <div class="row">
      <div class="col-12 text-center">
      </div>
    </div>
    <div class="row mt-4">
      <PokerTable ref="pokerTableRef" :players="players" :notification="notification"/>
      <button @click="next" class="w-25 h-10">TOUR SUIVANT</button>
      <button @click="nextPlayer" class="w-25 h-10">PLAYER SUIVANT</button>
      <button  @click="handleAction('fold')" id = "foldButton" class="w-25 h-10 action-buttons">FOLD</button>
      <button  @click="handleAction('check')" id="checkButton" class="w-25 h-10 action-buttons">CHECK</button>
      <button  @click="handleAction('call')" id="callButton" class="w-25 h-10 action-buttons">CALL</button>

      <fieldset id ="raiseButton" class="bg-white  action-buttons">
          <legend>Choisir le % du pot à relancer</legend>

          <div>
            <input type="radio" id="amount25" name="amount" value="0.25" v-model="raiseAmount" />
            <label for="amount25">25%</label>
          </div>

          <div>
            <input type="radio" id="amount50" name="amount" value="0.50" v-model="raiseAmount" />
            <label for="amount50">50%</label>
          </div>

          <div>
            <input type="radio" id="amount75" name="amount" value="0.75" v-model="raiseAmount" />
            <label for="amount75">75%</label>
          </div>

          <div>
            <input type="radio" id="amount100" name="amount" value="1" v-model="raiseAmount" />
            <label for="amount100">100%</label>
          </div>

          <div>
            <input type="radio" id="amountAllIn" name="amount" value="all" v-model="raiseAmount" />
            <label for="amountAllIn">All-in</label>
          </div>

          <button @click="handleAction('raise')" class="w-25 h-10">RAISE</button>
      </fieldset>
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
          <p class="bg-white w-3 text-black "> Au tour de : {{playerActifName}}</p>
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
      players: [],
      playerActifName : '',
      raiseAmount : null 
    };
  },
  methods: {
    async send() {
      try {
        const id = await this.getLocalPlayerId()
        const userData = await axios.get(`/api/users/${id}`)
        this.user = userData.data;
        this.socket.emit('joinGame', this.user.pseudo,id);
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

      this.socket.emit('nextTour');



    },
    //Obtenir son id local du joueur connecté actuellement
    async getLocalPlayerId() {
      return localStorage.getItem('id');
    },
    //Informe au serveur qu'un joueur vient de finir de jouer
    async nextPlayer() {
      this.socket.emit('nextPlayer');
    },
    getPlayers() {
      return this.players
    },
    //Retourne l'objet player d'id id
    getPlayerFromId(idATrouver) {
      const players = this.getPlayers()
      console.log("players : " , players)
      const playerActuel = players.find(player => player.id === idATrouver);
      return playerActuel
    },

  // Nouvelle méthode pour gérer les actions, elle valide au serveur que le joueur a bien joué (tourTermine)
  async handleAction(action) {
    //AllIn = true si le joueur a fait tapis
    var allin = false
    const playerLocalId = await this.getLocalPlayerId();
    if (this.raiseAmount == "all") {
      allin = true
    } 
    //Affichage à titre informatif sur le front
    if (action == "call") {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-success text-white';
      li.innerText = `Le joueur a call`;
    }

    // Affiche un message dans la console pour le debug
    console.log(`Action effectuée : ${action} par le joueur ${playerLocalId}, montant: ${this.raiseAmount || 0}`);
 

    //J'envoie au backend l'action qu'a chooisi le joueur et le montant du raise si il y en a un
    this.socket.emit("tourTermine", playerLocalId, { action, amount: this.raiseAmount || 0,allin });
    console.log("Événement tourTermine émis :", playerLocalId);
    this.isRaise = false; // Cache l'input après validation
    this.raiseAmount = 0; // Réinitialise le montant après envoi

    // Cache les boutons après l'action
    hideActionButtons();
  },
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
      li.innerText = `le pot est maintenant de : ${pot}`;
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

    //Affiche les boutons pour que le joueur d'id current turn joue et efface sur l'écran de l'ancien joueur actif
    this.socket.on('tourJoueur', async (currentTurn, PlayerCurrentName, montantACall) => {

      var playerLocalId = await this.getLocalPlayerId()
      console.log("playerLOcalId et currentTurn", playerLocalId, currentTurn)
      this.playerActifName = PlayerCurrentName
      // Si le joueur connecté correspond au joueur qui doit jouer alors on lui affiche ses boutons
      if (playerLocalId == currentTurn) {
        console.log("Montant à call : " , montantACall)
        const li = document.createElement('li');
        li.className = 'list-group-item bg-orange text-green';
        li.innerText = `Vous devez suivre : ${montantACall}`;
        document.getElementById('chat_connexion').appendChild(li);

        // Si un joueur n'a pas misé avant alors on affiche tt les boutons sinon on oblige à call or fold
        if (montantACall == 0) {
          showActionButtons()
        }else {
          showCallOrFoldButtons()
        }
      }else {
        hideActionButtons()
      }


    })

    // Wait for next DOM update to confirm refs are set, then call renderTable()
    await nextTick();
    if (this.$refs.pokerTableRef) {
      this.$refs.pokerTableRef.renderTable();
    }
  }
};

// Fonctions pour afficher/masquer les boutons de jeu
function showActionButtons() {
  const buttons = document.querySelectorAll(".action-buttons"); // Retourne un NodeList
    buttons.forEach(button => {
        button.style.display = "block";
    });
}
//Affiche seulement le bouton call et fold
function showCallOrFoldButtons() {
  const buttonCall = document.getElementById('callButton'); 
  const buttonFold = document.getElementById('foldButton'); 
  const buttonRaise = document.getElementById('raiseButton'); 
  const buttonCheck = document.getElementById('checkButton'); 

  buttonCall.style.display = "block";
  buttonFold.style.display = "block";
  buttonRaise.style.display = "none";
  buttonCheck.style.display = "none";


}
function hideActionButtons() {
  const buttons = document.querySelectorAll(".action-buttons"); // Retourne un NodeList
    buttons.forEach(button => {
        button.style.display = "none";
    });
}
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
  background-color:white;
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

.back {
  background-image: url(../img/background.png);
  background-repeat: no-repeat;
  background-size: 100vw, 100vh;
  position:fixed;
  z-index: 0; /* Gardez-le derrière le contenu */
  width:100vw;
  height:100vh;
  top:0;
}

input {
  margin-top: 10px;
}

</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
