var app = require('express')();
var http = require('http').Server(app); //Création d'un serveur http
var io = require('socket.io')(http);    // Init de socket.io

//Le serveur (socket.io) écoute tous les clients qui se connectent et se déconnectent
// .on permet d'écouter

app.get("/",function(req,res) {
    res.sendFile(__dirname +'/index.html');
})

io.on('connection', function (socket){
    console.log('un utilisateur s\'est connecté');
    socket.on('chat message',function(msg) {
        console.log('message reçu : ' +msg)
        io.emit('chat message' , msg);
    })
})



http.listen(3000, function() {
    console.log("serveur running sur 3000")
})