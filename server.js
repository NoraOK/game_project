const express = require('express');
const app = express();
app.use(express.static(__dirname + '/static/css'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
const server = app.listen(8001, () => console.log('listening on port 8001 <3'));
const io = require('socket.io')(server);

var chat = {}

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/game_1', (req, res) => {
    res.render('game_1')
});

io.on('connection', function (socket) {
    console.log('socket connected <3 <3 <3')
    socket.on('user_entered', function(data){
        socket.broadcast.emit('enter_msg', data)
    })
    socket.on('sending_msg', function (data) {
        console.log(data);
        chat += data;
        io.emit("all_msgs", data);
    })


})

