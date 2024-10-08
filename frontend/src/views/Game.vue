<template>
  <div>
    <h1>Jeu</h1>
    <p>Ceci est la page Jeu.</p>
    <div class="bloc_canva">
      <canvas id="pokerTable" width="800" height="500"></canvas>
    </div>

  </div>
</template>

<script>
export default {
  name: 'GamePlay',
  mounted() {
    const canvas = document.getElementById('pokerTable');
    const ctx = canvas.getContext('2d');

    // Dessiner la table de poker (un ovale)
    function drawPokerTable() {
      ctx.fillStyle = "#006400"; // Couleur verte de la table
      ctx.strokeStyle = "#000"; // Couleur du contour de la table
      ctx.lineWidth = 10;

      // Dessin de l'ovale
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 350, 200, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    function draw() {
      drawPokerTable();
    }

    draw();
  },
}
</script>

<style scoped>
h1 {
  color: green;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #2a2a2a;
}
canvas {
  border: 2px solid #000;
}

.bloc_canva {
  display:flex;
  justify-content: center;
}
</style>
