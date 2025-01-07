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
    <div v-if="showModal" class="modal-overlay show">
      <div class="modal-content">
      <h2>Félicitations au gagnant !</h2>
      <p><strong>Nom du gagnant :</strong> {{ winnerName }}</p>
      
      <!-- Afficher la combinaison gagnante seulement si winnerHand n'est pas vide -->
      <p v-if="winnerHand !== ''"><strong>Combinaison gagnante :</strong> {{ winnerHand }}</p>
      
      <h3>Malheureusement, le perdant...</h3>
      
      <!-- Afficher la combinaison du perdant seulement si loserHand n'est pas vide -->
      <p v-if="loserHand !== ''"><strong>Combinaison du perdant :</strong> {{ loserHand }}</p>
      
      <p><strong>Jetons gagnés :</strong> {{ nbChipsGagnes }}</p>
      
      <button @click="closeModal" class="btn btn-primary">Fermer</button>
      <button @click="send" class="btn btn-success">Rejouer</button>
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
      raiseAmount : null ,
      sharedCards : [],
      winnerName: '',      // Variable pour le nom du gagnant
      winnerHand: '',      // Variable pour la combinaison gagnante
      loserHand: '',
      nbChipsGagnes:null,
      showModal: false     // Variable pour contrôler l'affichage de la modale
    };
  },
  methods: {
    closeModal() {
      this.showModal = false
    },
    async send() {
      this.closeModal()
      this.sharedCards = []
      this.winnerName = ''
      this.winnerHand=''
      this.loserHand=''
      this.nbChipsGagnes=null

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
    async replay() {
      console.log("Relancement d'une partie")
    },
    async begin() {
      this.socket.emit('beginGame');
    },
    async checkStatus() {
      this.isLogged = localStorage.getItem('isLoggedIn') === 'true';
    },
    async next() {

      this.socket.emit('nextTour');
      this.socket.emit('nextPlayer');


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
    //Methode qui s'occupe de dessiner les cartes communes
    drawSharedCards(canvas) {
        
      // on fait la conversion pr transformer la forme de la carte en la premeire lettre en anglais pr 
      // que ça corresponde à l'url de l'API
      const suitMap = {
          'coeur': 'H',   // Hearts
          'carreau': 'D', // Diamonds
          'pique': 'S',   // Spades
          'trèfle': 'C'   // Clubs
      };

        //Je pars des coordonées du centre de la table
        var x = canvas.width / 2
        var y = canvas.height / 2 
        var indexSharedCard = 0
                    // On dessine les nouvelles cartes sur la table

          //On choisit la position des cartes du board en fonction de leur indice (la cbème qui tombe)
          this.sharedCards.forEach(card => {
            console.log("Carte analysé : " , card)
            indexSharedCard +=1
            switch (indexSharedCard) {
            case 1 :
              x = canvas.width / 2 - 150;
              break
            case 2 :
              x = canvas.width / 2 - 75;
              break
            case 3 : 
              x = canvas.width / 2 ;
              break
            case 4 : 
              x = canvas.width / 2 + 75;
              break
            case 5 : 
              x = canvas.width / 2 + 150;
              break
              default:
                console.log("nb cartes communes invalide")
          }
            var cardRank = card.rank
            var cardSuit = card.suit
            //on transforme pr éviter le pb avec l'url du 10
              if (cardRank == '10') {
                cardRank = '0' ;
              }

            var commonCard = `${cardRank}${suitMap[cardSuit]}`


    

            this.$refs.pokerTableRef.drawCardWithAnimation(x,y,commonCard)
            this.socket.emit("nextPlayer")
      })          
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

    //UpdatePotEtStack utilisé lors de la win d'un joueur
    this.socket.on("updatePot&StackWin", (players, pot, winnerName, nbJetonsGagnes,mainGagnante, mainPerdante) => {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      console.log(winnerName, " a gagné avec : " ,mainGagnante, " face à : " , mainPerdante, "et a gagné : " , nbJetonsGagnes)
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
          this.$refs.pokerTableRef.drawCardWithAnimation(player.x+30,player.y+30,cardCode1)
          this.$refs.pokerTableRef.drawCardWithAnimation(player.x+70,player.y+30,cardCode2)
         // Affichage de la modale
         this.winnerName = winnerName
         this.winnerHand = mainGagnante
         this.nbChipsGagnes = nbJetonsGagnes
         this.loserHand = mainPerdante
         //On ajoute 1,5s de délai à la modale
         setTimeout(() => {
            this.showModal = true
          }, 1500);

      });


      console.log("this.sharedCards : " , this.sharedCards)
      const li = document.createElement('li');
      li.className = 'list-group-item bg-info text-white';
      li.innerText = `le pot est maintenant de : ${pot}`;
      document.getElementById('chat_connexion').appendChild(li);
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
          this.$refs.pokerTableRef.drawCardWithAnimation(player.x+30,player.y+30,cardCode1)
          this.$refs.pokerTableRef.drawCardWithAnimation(player.x+70,player.y+30,cardCode2)


      });

      if (this.sharedCards != []) {
        this.drawSharedCards(canvas)
      }
      

      console.log("this.sharedCards : " , this.sharedCards)
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

    //Passage à la prochaine street (initialisation des nouvelles cartes etc)
    this.socket.on('nouvelleStreet', (streetCourante) => {
      console.log("streetCourante = ", streetCourante)
      //1 = Flop ; 2 = Turn ; 3 = River
      if (streetCourante == 1) {
        console.log("Affichage des cartes communes du flop")
      }else if (streetCourante == 2) {
        console.log("Affichage des cartes communes de la turn ")
      }else if (streetCourante == 3) {
        console.log("Affichage des cartes communes de la river")
      }
    })
    this.socket.on("cartesCommunes", (sharedCards) => {
      this.sharedCards = sharedCards;
      console.log("Cartes communes reçues : ", sharedCards);
      
      const canvas = document.getElementById('pokerTable');
      this.drawSharedCards(canvas);

      setTimeout(() => {
        console.log("1 seconde s'est écoulée après le dessin des cartes.");
        // Place ici le code à exécuter après 1 seconde
      }, 1000);
    });

    //Affiche les boutons pour que le joueur d'id current turn joue et efface sur l'écran de l'ancien joueur actif
    this.socket.on('tourJoueur', async (currentTurn, PlayerCurrentName, montantACall) => {

      var playerLocalId = await this.getLocalPlayerId()
      console.log("playerLOcalId et currentTurns", playerLocalId, currentTurn)
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 400px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
}

.modal-title {
  margin: 0;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  font-size: 14px;
  color: #333;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Style pour l'overlay de la modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Ombre de fond noir semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

/* Activer la visibilité de la modale avec la classe .show */
.modal-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

/* Style pour le contenu de la modale */
.modal-content {
  background-color: #2c2c2c;  /* Fond noir */
  color: #fff;  /* Texte en blanc */
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  animation: modalIn 0.4s ease-out;
}

/* Animation d'entrée pour la modale */
@keyframes modalIn {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Style pour le titre principal */
.modal-content h2 {
  color: #f44336; /* Rouge vif pour le titre */
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-family: 'Arial', sans-serif;
}

/* Style pour les sous-titres */
.modal-content h3 {
  color: #f44336;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  font-family: 'Arial', sans-serif;
}

/* Style pour le texte général */
.modal-content p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-family: 'Arial', sans-serif;
}

/* Mise en valeur des textes avec strong */
.modal-content strong {
  font-weight: bold;
  color: #ffeb3b; /* Jaune pour mettre en évidence */
}

/* Style pour le bouton de fermeture */
.modal-content button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 2rem;
}

.modal-content button:hover {
  background-color: #d32f2f; /* Changer de couleur au survol */
}

.modal-content button:focus {
  outline: none;
}

/* Style spécifique au texte de la modale */
.modal-content p:last-child {
  font-size: 1.3rem;
  font-weight: bold;
}

/* Animation de l'apparition de la modale (lorsque showModal devient true) */
@keyframes modalIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}


</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
