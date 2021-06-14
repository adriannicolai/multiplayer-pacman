/* express */
const express = require('express');
const app = express();

/* ejs */
const ejs = require('ejs');
app.set('/views', __dirname + '/views')
app.set('view engine', 'ejs');

/* static files fodler */
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/images'));
/* socket.io */
const server = app.listen(8000, function(){
    console.log('listening at port 8000!');
});

const io = require('socket.io')(server);
var players = [];

io.on('connection', function(socket){
    socket.on('newUser', function(newUser){
        io.emit('newUserjoined', newUser);
        socket.emit('serveSocketId', socket.id);
        players.push({name:newUser, socketId:socket.id});
    });

    socket.on('sendMessage', function(message){
        io.emit('newMessage', message);
    });

    socket.on('newScore', function(score){
        // console.log(players);
        for(let x in players){
            if(players[x].socketId == socket.id){
                players[x].score = score;
            }
        }
        io.emit('updateOponentCard', players);
    });
});

/* log the request url */
app.use((req, res, next)=>{
    console.log('a nre request has been made at:', req.url);
    next();
});

/* request url goes here */
app.get('/', function (req, res) {
    res.render('pacman');
});

/* redirect tp '/' if there is no valid link */
app.use((req, res)=>{
    res.redirect('/');
})