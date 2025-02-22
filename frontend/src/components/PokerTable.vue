<template>
  <div class="table-container">
    <div class="bloc_canva position-relative">
      <canvas id="pokerTable" width="600" height="450" class="border border-light rounded"></canvas>
      <div
        class="position-absolute top-50 start-50 translate-middle text-white fw-bold"
        v-if="notification"
      >
        {{ notification }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayedCards: [] // Stocke les cartes affichées sous forme d'objets {x, y, card}
    };
  },
  name: 'PokerTable',
  props: {
    players: {
      type: Array,
      default: () => []
    },
    notification: {
      type: String,
      default: ''
    }
  },
  methods: {
    // Dessine la table
    drawPokerTable(ctx, canvas, pot) {
      ctx.fillStyle = "#006400"; // Couleur de fond de la table
      ctx.strokeStyle = "#000";   // Couleur du contour
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 250, 150, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sauvegarde du contexte avant d'appliquer des styles spécifiques au texte du pot
      ctx.save();
      if (pot === undefined) {
        pot = 0;
      }

      // Style et position du texte du pot
      ctx.fillStyle = "#000";        // Couleur du texte en noir
      ctx.font = "24px Arial";       // Taille et style de la police
      ctx.textAlign = "center";      // Alignement horizontal centré
      ctx.textBaseline = "middle";   // Alignement vertical centré
      ctx.fillText(`Pot : ${pot}`, canvas.width / 2, canvas.height / 2 - 30); // Texte centré

      // Restauration du contexte après avoir dessiné le texte du pot
      ctx.restore();
    },
  

    // Dessine le joueur sur la table avec son pseudo, sa position et ses jetons et ses cartes
    drawPlayer(ctx, player, x, y) {
      ctx.beginPath();
      ctx.arc(x, y - 25, 30, 0, Math.PI * 2); // Cercle du joueur
      ctx.fillStyle = "black"; // Remplissage noir
      ctx.fill(); // Remplit le cercle
      ctx.stroke(); // Dessine le contour du cercle

      // Style du texte
      ctx.fillStyle = "white"; // Couleur du texte en blanc
      ctx.font = "bold 10px Arial"; // Texte en gras, taille 14px

      // Affiche la position réelle (en majuscule)
      ctx.fillText(this.givePosition(player.p_reelle).toUpperCase(), x - 10, y - 80);

      // Affiche les jetons du joueur
      ctx.fillText(`${player.chips}`.toUpperCase(), x - 10, y - 65);

      // Affiche le pseudo du joueur en blanc et en majuscule
      ctx.fillText(player.name.toUpperCase(), x-25, y - 20);

      ctx.stroke();
    },

    drawCard(x, y, card) {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = `https://deckofcardsapi.com/static/img/${card}.png`; // URL de l'image de la carte souhaitée

      img.onload = () => {
        const cardWidth = 50; // Largeur de la carte
        const cardHeight = 70; // Hauteur de la carte
        ctx.drawImage(img, x, y, cardWidth, cardHeight);
      };

      img.onerror = () => {
        console.error("Erreur lors du chargement de l'image de la carte.");
      };
    },

    // Retourne sous forme de chaine de caractère la position du joueur
    givePosition(indexPosition) {
      switch (indexPosition) {
        case 0: return 'BTN';
        case 1: return 'SB';
        case 2: return 'BB';
        case 3: return 'HJ';
        case 4: return 'LJ';
        case 5: return 'CO';
        default: return 'Inconnue';
      }
    },

    drawCardWithAnimation(x,y, card, duration = 1000) {
      const canvas = document.getElementById('pokerTable');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = `https://deckofcardsapi.com/static/img/${card}.png`; // URL de l'image de la carte

  img.onload = () => {
    const cardWidth = 40;  // Largeur de la carte
    const cardHeight = 60; // Hauteur de la carte
    const startTime = performance.now(); // Heure de début de l’animation

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Calcul de la progression (entre 0 et 1)

      // Réglage de l'opacité (de 0 à 1 selon la progression)
      ctx.globalAlpha = progress;

      // Efface uniquement la zone de la carte pour éviter les traînées
      ctx.clearRect(x, y, cardWidth, cardHeight);

      // Dessine la carte avec l'opacité actuelle
      ctx.drawImage(img, x, y, cardWidth, cardHeight);

      // Réinitialise l’opacité après le dessin
      ctx.globalAlpha = 1;

      // Si l'animation n'est pas terminée, on continue
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  img.onerror = () => {
    console.error("Erreur lors du chargement de l'image de la carte.");
  };
    },

    // Lance la création de la table
    renderTable() {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      this.drawPokerTable(ctx, canvas, 0);
      this.players.forEach((player, index) => {
        // Place players around the table (basic example)
        const angle = (2 * Math.PI * index) / this.players.length;
        const x = canvas.width / 2 + Math.cos(angle) * 300;
        const y = canvas.height / 2 + Math.sin(angle) * 150;
        this.drawPlayer(ctx, player, x, y);
      });
    },

    // Efface les canvas et redessine tout lorsqu'un joueur quitte la partie
    cleanPlayersOverride(ctx, players, pot) {
      // Efface tout le contenu du canevas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Redessine la table
      this.drawPokerTable(ctx, ctx.canvas, pot);

      if (players.length > 0) {
        // Redessine tous les joueurs sauf celui à effacer
        players.forEach((player) => {
          this.drawPlayer(ctx, player, player.x, player.y);
        });
      }
    }
  },
  watch: {
    players() {
      this.renderTable();
    }
  },
  mounted() {
    this.renderTable();
  }
};
</script>

<style scoped>

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  border: 2px solid #28a745; /* Bordure verte */
  background-color: rgba(255, 255, 255, 0.3); /* Fond vert à moitié transparent */

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
</style>
