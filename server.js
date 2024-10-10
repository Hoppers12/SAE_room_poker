const express = require('express');
const cors = require('cors'); // Import CORS
const http = require('http');
const socketIo = require('socket.io');
const Player = require('./classesJeu/Player');


const app = express();
const server = http.createServer(app);



const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    },
    transports: ['websocket'] // Use WebSocket transport
});


// Enable CORS for all requests
app.use(cors());

// GESTIO NDE L'ARRIVE DE JOUEURS DANS LA PARTIE

let players = [] //Tableau contenant tous les joueurs présents
let game = null
io.on('connection', (socket) => {
    console.log('A user connected',socket.id);

    // Handle incoming messages from clients
    socket.on('joinGame', (pseudo) =>
    {
        console.log(Player)
        const newPlayer = new Player(pseudo,1000) ;
        players.push(newPlayer);
        io.emit("recevoirJoueur",newPlayer) // Message qui avertit qu'un new joueur arrive en donnant le pseudo

        //Gestion de la deconnexion des joueurs
        socket.on('disconnect', (socket) =>
        {
            console.log('A user disconnected');

            // Supprimer le joueur déconnecté de la liste des joueurs
            players = players.filter(player => player !== newPlayer);
            console.log(players)
            io.emit("quitterJoueur",newPlayer);
            // Boucle pour afficher les pseudos de tous les joueurs
            /*
            players.forEach(player => {
                console.log(player.pseudo);
            });
            */
             */
        });


    });






});

app.get('/', (req, res) => {
    res.json("Bienvenue dans le serveur");
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});

