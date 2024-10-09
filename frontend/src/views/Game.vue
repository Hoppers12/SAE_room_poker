<template>
  <div>
    <h1>Jeu</h1>
    <p>Ceci est la page Jeu.</p>
    <div class="bloc_canva">
      <canvas id="pokerTable" width="800" height="500"></canvas>
      <p v-if="notification">{{ notification }}</p>
      <div>
        <ul id="chat_connexion"></ul>
      </div>

    </div>

  </div>
</template>

<script>
import { io } from "socket.io-client"; // Importer Socket.IO client
export default {
  name: 'GamePlay',
  data() {
    return {
      notification:'',
    };
  },
  mounted() {

    const canvas = document.getElementById('pokerTable');
    const ctx = canvas.getContext('2d');


    const socket = io('http://localhost:5000', {
      transports: ['websocket'], // Utiliser uniquement WebSocket
    });




    socket.on('connect', function() {
      console.log('Connexion réussie au serveur WebSocket');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection failed:', err);
    });

    var receive_user = function (msg) {
      var li = document.createElement('li');
      li.innerText = msg;
      document.getElementById('chat_connexion').appendChild(li);
    }

    socket.on('user connect', receive_user);
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
