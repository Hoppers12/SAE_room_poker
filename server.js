const express = require('express');
const cors = require('cors'); // Import CORS
const http = require('http');
const socketIo = require('socket.io');

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

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages from clients
    socket.on('message', (msg) => {
        console.log('Message received: ', msg);
    });

    //Message qui broadcast tous les joueurs qu'un nouveau joueur est arrivé
    io.emit("user connect",'un nouveau joueur est arrivé');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/', (req, res) => {
    res.json("Bienvenue dans le serveur");
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
