<template>
  <div class="table-container">
    <div class="bloc_canva position-relative">
      <canvas id="pokerTable" width="800" height="600" class="border border-light rounded"></canvas>
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
    //Dessine la table
    drawPokerTable(ctx, canvas, pot) {
      ctx.fillStyle = "#006400"; // Couleur de fond de la table
      ctx.strokeStyle = "#000";   // Couleur du contour
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 350, 200, 0, 0, Math.PI * 2);
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
      ctx.fillText(`Pot : ${pot}`, canvas.width / 2, canvas.height / 2); // Texte centré

      // Restauration du contexte après avoir dessiné le texte du pot
      ctx.restore();
    },

      //Dessine le joueur sur la table avec son pseudo, sa position et ses jetons et ses cartes
      drawPlayer(ctx, player, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fillText(this.givePosition(player.p_reelle), x - 15, y - 5);
        ctx.fillText(player.name, x - 15, y + 5);
        ctx.fillText(`${player.chips} jetons`, x - 25, y + 50);

        if (player.hand.length > 0) {
          // Vérifie si player.hand contient des cartes avant de dessiner
          ctx.fillText(`${player.hand[0].rank} de ${player.hand[0].suit}`, x - 25, y + 60);
          if (player.hand.length > 1) {
            ctx.fillText(`${player.hand[1].rank} de ${player.hand[1].suit}`, x -25, y + 70);
          }
        }

        ctx.stroke();
      },
      //Retourne sous forme de chaine de caractère la position du joueur
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
    //Lance la création de la table
    renderTable() {
      const canvas = document.getElementById('pokerTable');
      const ctx = canvas.getContext('2d');
      this.drawPokerTable(ctx, canvas,0);
      this.players.forEach((player, index) => {
        // Place players around the table (basic example)
        const angle = (2 * Math.PI * index) / this.players.length;
        const x = canvas.width / 2 + Math.cos(angle) * 300;
        const y = canvas.height / 2 + Math.sin(angle) * 150;
        this.drawPlayer(ctx, player, x, y);
      });
    },
    //Efface les canvas et redessine tout lorsqu'un joueur quitte la partie
    cleanPlayersOverride(ctx,players,pot) {
      // Efface tout le contenu du canevas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Redessine la table
      this.drawPokerTable(ctx, ctx.canvas,pot);

      if (players.length>0) {
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
</style>
