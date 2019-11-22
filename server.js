const express = require('express');
const app = express();
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
const server = app.listen(8002, () => console.log('listening on port 8000 <3'));
const io = require('socket.io')(server);

var chat = {}

var world = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 3, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 3, 3, 3, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 3, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 3, 1, 3, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

var rps_game = [];

var push_count = 0;
ninjas = []

NS = [
    ninjaman1 = {
        name: "",
        x: 1,
        y: 1,
        score: 0,
        top: 0,
        left: 0,
    },
    ninjaman2 = {
        name: "",
        x: 29,
        y: 1,
        score: 0,
        top: 0,
        left: 0,
    },
]

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/game_1', (req, res) => {
    res.render('game_1')
});

app.get('/game_2',(req, res) =>{
    res.render('game_2')
});


function resolve_rps(){
    if(rps_game.length == 2){
        //player 1: rock, player 2: paper wins
        if(rps_game[0].val == 'rock' && rps_game[1].val == 'paper'){
            io.emit('player_won',{winner: rps_game[1].player, winner_count : rps_game[1].count})
        }
        //player 1: rock wins, player 2: scissors
        if(rps_game[0].val == 'rock' && rps_game[1].val == 'scissors'){
            io.emit('player_won',{winner: rps_game[0].player})
        }
        //player 1: rock TIE, player 2: rock TIE
        if(rps_game[0].val == 'rock' && rps_game[1].val == 'rock'){
            io.emit('tie_game',"Tie game, PLAY AGAIN!")
        }
        //player 1: paper wins, player 2: rock 
        if(rps_game[0].val == 'paper' && rps_game[1].val == 'rock'){
            io.emit('player_won',{winner: rps_game[0].player})
        }
        //player 1: paper , player 2: scissors wins 
        if(rps_game[0].val == 'paper' && rps_game[1].val == 'scissors'){
            io.emit('player_won',{winner: rps_game[1].player})
        }
        //player 1: paper TIE, player 2: paper TIE 
        if(rps_game[0].val == 'paper' && rps_game[1].val == 'paper'){
            io.emit('tie_game',"Tie game, PLAY AGAIN!")
        }
        //player 1: scissors , player 2: rock wins 
        if(rps_game[0].val == 'scissors' && rps_game[1].val == 'rock'){
            io.emit('player_won',{winner: rps_game[1].player, winner_count : rps_game[1].count, loser: rps_game[1].player})
        }
        //player 1: scissors wins, player 2: paper  
        if(rps_game[0].val == 'scissors' && rps_game[1].val == 'paper'){
            io.emit('player_won',{winner: rps_game[0].player})
        }
        //player 1: scissors TIE, player 2: scissors TIE  
        if(rps_game[0].val == 'scissors' && rps_game[1].val == 'scissors'){
            io.emit('tie_game',"Tie game, PLAY AGAIN!")
        }
        console.log(rps_game)
        rps_game = []
        console.log(rps_game)
    }

}

io.on('connection', function (socket) {
    socket.emit('build_World', world)
    console.log('socket connected <3 <3 <3')
    socket.on('user_entered', function (data) {
        var count = 0;
        for (ninja in ninjas) {
            count++;
            if (count > 1) {
                console.log('refresh')
                ninjas = []
            }
        }
        ninjas.push(data)
        if (ninjas[1]) {
            NS[1].name = ninjas[1]
        } else {
            NS[0].name = ninjas[0]
        }
        console.log(NS[0], NS[1], ninjas, "all ninjas")
        io.emit('move_Ninja', NS[0], NS[1], ninjas)
        socket.broadcast.emit('enter_msg', data)
    })

    socket.on('sending_msg', function (data) {
        console.log(data);
        chat += data;
        io.emit("all_msgs", data);
    })
    socket.on('push_rock', function(data){
        rps_game.push(data);
        resolve_rps()

    })
    socket.on('push_paper', function(data){
        rps_game.push(data); 
        resolve_rps()

    })
    socket.on('push_scissors', function(data){
        rps_game.push(data);
        resolve_rps()
    })

    // Controls

    socket.on('left', function (user) {
    
        if (NS[0].name == user) {
            console.log(user, 'look')
            if (world[NS[0].y][NS[0].x - 1] != 1) {
                ninjaman1.x--;
            }
            io.emit('move_Ninja1', NS[0], ninjas)
        } else {
            if (world[NS[1].y][NS[1].x - 1] != 1) {
                ninjaman2.x--;
            }
            io.emit('move_Ninja2',NS[1], ninjas)
        }
        console.log(NS[0], NS[1], ninjas)
    })

    socket.on('right', function (user) {

        if (NS[0].name == user) {
            console.log(user, 'look')
            if (world[NS[0].y][NS[0].x + 1] != 1) {
                ninjaman1.x++;
            }
            io.emit('move_Ninja1', NS[0], ninjas)
        } else {
            if (world[NS[1].y][NS[1].x + 1] != 1) {
                ninjaman2.x++;
            }
            io.emit('move_Ninja2',NS[1], ninjas)
        }
        console.log(ninjaman1, ninjaman2, ninjas)
    })

    socket.on('up', function (user) {
     
        if (NS[0].name == user) {
            console.log(user, 'look')
            if (world[NS[0].y - 1][NS[0].x] != 1) {
                ninjaman1.y--;
            }
            io.emit('move_Ninja1', NS[0], ninjas)
        } else {
            if (world[NS[1].y - 1][NS[1].x] != 1) {
                ninjaman2.y--;
            }
            io.emit('move_Ninja2',NS[1], ninjas)
        }
        console.log(ninjaman1, ninjaman2, ninjas)
    })
    socket.on('down', function (user) {

        if (NS[0].name == user) {
            console.log(user, 'look')
            if (world[NS[0].y + 1][NS[0].x] != 1) {
                ninjaman1.y++;
            }
            io.emit('move_Ninja1', NS[0], ninjas)
        } else {
            if (world[NS[1].y + 1][NS[1].x] != 1) {
                ninjaman2.y++;
            }
            io.emit('move_Ninja2',NS[1], ninjas)
        }
        console.log(ninjaman1, ninjaman2, ninjas)
    })
    io.emit('move_Ninja1', NS[0], ninjas)
    io.emit('move_Ninja2',NS[1], ninjas)
})

// End of Controls