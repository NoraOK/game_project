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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 4, 4, 4, 4, 1, 3, 1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 1, 3, 1, 4, 4, 4, 4, 3, 1],
    [1, 4, 1, 1, 1, 4, 1, 4, 1, 1, 4, 1, 4, 1, 1, 1, 1, 1, 4, 1, 4, 1, 1, 4, 1, 4, 1, 1, 1, 4, 1],
    [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 2, 3, 2, 1, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 4, 1],
    [1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1],
    [1, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 1],
    [1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1, 2, 1, 4, 1],
    [1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 1, 1, 1, 2, 2, 2, 1, 1, 1, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1],
    [1, 4, 1, 3, 1, 4, 1, 1, 1, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 1, 1, 1, 4, 1, 3, 1, 4, 1],
    [1, 4, 4, 4, 1, 4, 1, 4, 4, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 4, 4, 1, 4, 1, 4, 4, 4, 1],
    [1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1],
    [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 2, 1, 2, 1, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 1, 4, 1],
    [1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1],
    [1, 3, 4, 4, 4, 4, 1, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 1, 4, 4, 4, 4, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

var rps_game = [];

var push_count = 0;
ninjas = []

NS = [
    ninjaman1 = {
        name: "",
        x: 3,
        y: 3,
        score: 0,
        top: 0,
        left: 0,
    },
    ninjaman2 = {
        name: "",
        x: 27,
        y: 3,
        score: 0,
        top: 0,
        left: 0,
    },
    ninjaman3 = {
        name: "",
        x: 3,
        y: 13,
        score: 0,
        top: 0,
        left: 0,
    },
    ninjaman4 = {
        name: "",
        x: 27,
        y: 13,
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

app.get('/game_2', (req, res) => {
    res.render('game_2')
});


function resolve_rps() {
    if (rps_game.length == 2) {
        //player 1: rock, player 2: paper wins
        if (rps_game[0].val == 'rock' && rps_game[1].val == 'paper') {
            io.emit('player_won', { winner: rps_game[1].player, winner_count: rps_game[1].count })
        }
        //player 1: rock wins, player 2: scissors
        if (rps_game[0].val == 'rock' && rps_game[1].val == 'scissors') {
            io.emit('player_won', { winner: rps_game[0].player })
        }
        //player 1: rock TIE, player 2: rock TIE
        if (rps_game[0].val == 'rock' && rps_game[1].val == 'rock') {
            io.emit('tie_game', "Tie game, PLAY AGAIN!")
        }
        //player 1: paper wins, player 2: rock 
        if (rps_game[0].val == 'paper' && rps_game[1].val == 'rock') {
            io.emit('player_won', { winner: rps_game[0].player })
        }
        //player 1: paper , player 2: scissors wins 
        if (rps_game[0].val == 'paper' && rps_game[1].val == 'scissors') {
            io.emit('player_won', { winner: rps_game[1].player })
        }
        //player 1: paper TIE, player 2: paper TIE 
        if (rps_game[0].val == 'paper' && rps_game[1].val == 'paper') {
            io.emit('tie_game', "Tie game, PLAY AGAIN!")
        }
        //player 1: scissors , player 2: rock wins 
        if (rps_game[0].val == 'scissors' && rps_game[1].val == 'rock') {
            io.emit('player_won', { winner: rps_game[1].player, winner_count: rps_game[1].count, loser: rps_game[1].player })
        }
        //player 1: scissors wins, player 2: paper  
        if (rps_game[0].val == 'scissors' && rps_game[1].val == 'paper') {
            io.emit('player_won', { winner: rps_game[0].player })
        }
        //player 1: scissors TIE, player 2: scissors TIE  
        if (rps_game[0].val == 'scissors' && rps_game[1].val == 'scissors') {
            io.emit('tie_game', "Tie game, PLAY AGAIN!")
        }
        console.log(rps_game)
        rps_game = []
        console.log(rps_game)
    }

}

io.on('connection', function (socket) {
    io.emit('build_World', world)
    console.log('socket connected <3 <3 <3')
    socket.on('user_entered', function (data) {
        world = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 4, 4, 4, 4, 1, 3, 1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 1, 3, 1, 4, 4, 4, 4, 3, 1],
            [1, 4, 1, 1, 1, 4, 1, 4, 1, 1, 4, 1, 4, 1, 1, 1, 1, 1, 4, 1, 4, 1, 1, 4, 1, 4, 1, 1, 1, 4, 1],
            [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 2, 3, 2, 1, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 4, 1],
            [1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1],
            [1, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 1],
            [1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1, 2, 1, 4, 1],
            [1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 1, 1, 1, 2, 2, 2, 1, 1, 1, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1],
            [1, 4, 1, 3, 1, 4, 1, 1, 1, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 1, 1, 1, 4, 1, 3, 1, 4, 1],
            [1, 4, 4, 4, 1, 4, 1, 4, 4, 4, 1, 1, 1, 4, 1, 4, 1, 4, 1, 1, 1, 4, 4, 4, 1, 4, 1, 4, 4, 4, 1],
            [1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1],
            [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 2, 1, 2, 1, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 1, 4, 1],
            [1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1],
            [1, 3, 4, 4, 4, 4, 1, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 1, 4, 4, 4, 4, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        var count = 0;
        for (ninja in ninjas) {
            count++;
            if (count > 3) {
                console.log('refresh')
                ninjas = []
            }
        }
        ninjas.push(data)
        if (ninjas[0] && !ninjas[1]) {
            NS[0].x = 3
            NS[0].y = 3
            NS[0].name = ninjas[0]
        }
        if (ninjas[1] && !ninjas[2]) {
            NS[1].x = 27
            NS[1].y = 3
            NS[1].name = ninjas[1]
        }
        if (ninjas[2] && !ninjas[3]) {
            NS[2].x = 3
            NS[2].y = 13
            NS[2].name = ninjas[2]
        }
        if (ninjas[3]) {
            NS[3].x = 27
            NS[3].y = 13
            NS[3].name = ninjas[3]
        }
        console.log(NS[0], NS[1], NS[2], NS[3], ninjas, "all ninjas")
        io.emit('move_Ninja1', NS[0], ninjas)
        io.emit('move_Ninja2', NS[1], ninjas)
        io.emit('move_Ninja3', NS[2], ninjas)
        io.emit('move_Ninja4', NS[3], ninjas)
        socket.broadcast.emit('enter_msg', data)
    })

    socket.on('sending_msg', function (data) {
        console.log(data);
        chat += data;
        io.emit("all_msgs", data);
    })
    socket.on('push_rock', function (data) {
        rps_game.push(data);
        resolve_rps()

    })
    socket.on('push_paper', function (data) {
        rps_game.push(data);
        resolve_rps()

    })
    socket.on('push_scissors', function (data) {
        rps_game.push(data);
        resolve_rps()
    })

    // Controls

    var controlsDict = {
        1: "rotateleft",
        2: "rotateright",
        3: "rotateup",
        4: "rotatedown",
    }
    // LEFT........................................................................................................................
    
    socket.on('left', function (user) {
        if (ninjas[3]) {

            if (NS[0].name == user) {
                if (world[NS[0].y][NS[0].x - 1] != 1) {
                    ninjaman1.x--;
                }
                if (world[NS[0].y][NS[0].x] == 2) {
                    NS[0].score += 10;
                }
                if (world[NS[0].y][NS[0].x] == 3) {
                    NS[0].score += 5;
                }
                if (world[NS[0].y][NS[0].x] == 4) {
                    NS[0].score += 1;
                }
                world[NS[0].y][NS[0].x] = 0;
                io.emit('move_Ninja1', NS[0], ninjas, controlsDict[1])
            }
            if (NS[1].name == user) {
                if (world[NS[1].y][NS[1].x - 1] != 1) {
                    ninjaman2.x--;
                }
                if (world[NS[1].y][NS[1].x] == 2) {
                    NS[1].score += 10;
                }
                if (world[NS[1].y][NS[1].x] == 3) {
                    NS[1].score += 5;

                }
                if (world[NS[1].y][NS[1].x] == 4) {
                    NS[1].score += 1;
                }
                world[NS[1].y][NS[1].x] = 0;
                io.emit('move_Ninja2', NS[1], ninjas, controlsDict[1])
            }
            if (NS[2].name == user) {
                if (world[NS[2].y][NS[2].x - 1] != 1) {
                    ninjaman3.x--;
                }
                if (world[NS[2].y][NS[2].x] == 2) {
                    NS[2].score += 10;
                }
                if (world[NS[2].y][NS[2].x] == 3) {
                    NS[2].score += 5;
                }
                if (world[NS[2].y][NS[2].x] == 4) {
                    NS[2].score += 1;
                }
                world[NS[2].y][NS[2].x] = 0;
                io.emit('move_Ninja3', NS[2], ninjas, controlsDict[1])
            }
            if (NS[3].name == user) {
                if (world[NS[3].y][NS[3].x - 1] != 1) {
                    ninjaman4.x--;
                }
                if (world[NS[3].y][NS[3].x] == 2) {
                    NS[3].score += 10;
                }
                if (world[NS[3].y][NS[3].x] == 3) {
                    NS[3].score += 5;
                }
                if (world[NS[3].y][NS[3].x] == 4) {
                    NS[3].score += 1;
                }
                world[NS[3].y][NS[3].x] = 0;
                io.emit('move_Ninja4', NS[3], ninjas, controlsDict[1])
            }
        }
            io.emit('build_World', world)

        })

        // RIGHT........................................................................................................................

        socket.on('right', function (user) {
            if (ninjas[3]) {
            if (NS[0].name == user) {
                console.log(user, 'look')
                if (world[NS[0].y][NS[0].x + 1] != 1) {
                    ninjaman1.x++;
                }
                if (world[NS[0].y][NS[0].x] == 2) {
                    NS[0].score += 10;
                }
                if (world[NS[0].y][NS[0].x] == 3) {
                    NS[0].score += 5;
                }
                if (world[NS[0].y][NS[0].x] == 4) {
                    NS[0].score += 1;
                }
                world[NS[0].y][NS[0].x] = 0;
                io.emit('move_Ninja1', NS[0], ninjas, controlsDict[2])
            }
            if (NS[1].name == user) {
                if (world[NS[1].y][NS[1].x + 1] != 1) {
                    ninjaman2.x++;
                }
                if (world[NS[1].y][NS[1].x] == 2) {
                    NS[1].score += 10;
                }
                if (world[NS[1].y][NS[1].x] == 3) {
                    NS[1].score += 5;
                }
                if (world[NS[1].y][NS[1].x] == 4) {
                    NS[1].score += 1;
                }
                world[NS[1].y][NS[1].x] = 0;
                io.emit('move_Ninja2', NS[1], ninjas, controlsDict[2])
            }
            if (NS[2].name == user) {
                if (world[NS[2].y][NS[2].x + 1] != 1) {
                    ninjaman3.x++;
                }
                if (world[NS[2].y][NS[2].x] == 2) {
                    NS[2].score += 10;
                }
                if (world[NS[2].y][NS[2].x] == 3) {
                    NS[2].score += 5;
                }
                if (world[NS[2].y][NS[2].x] == 4) {
                    NS[2].score += 1;
                }
                world[NS[2].y][NS[2].x] = 0;
                io.emit('move_Ninja3', NS[2], ninjas, controlsDict[2])
            }
            if (NS[3].name == user) {
                if (world[NS[3].y][NS[3].x + 1] != 1) {
                    ninjaman4.x++;
                }
                if (world[NS[3].y][NS[3].x] == 2) {
                    NS[3].score += 10;
                }
                if (world[NS[3].y][NS[3].x] == 3) {
                    NS[3].score += 5;
                }
                if (world[NS[3].y][NS[3].x] == 4) {
                    NS[3].score += 1;
                }
                world[NS[3].y][NS[3].x] = 0;
                io.emit('move_Ninja4', NS[3], ninjas, controlsDict[2])
            }
        }
            io.emit('build_World', world)
        })

        // UP........................................................................................................................

        socket.on('up', function (user) {
            if (ninjas[3]) {
            if (NS[0].name == user) {
                if (world[NS[0].y - 1][NS[0].x] != 1) {
                    ninjaman1.y--;
                }
                if (world[NS[0].y][NS[0].x] == 2) {
                    NS[1].score -= 10;
                }
                if (world[NS[0].y][NS[0].x] == 3) {
                    NS[0].score += 5;
                }
                if (world[NS[0].y][NS[0].x] == 4) {
                    NS[0].score += 1;
                }
                world[NS[0].y][NS[0].x] = 0;
                io.emit('move_Ninja1', NS[0], ninjas, controlsDict[3])
            }
            if (NS[1].name == user) {
                if (world[NS[1].y - 1][NS[1].x] != 1) {
                    ninjaman2.y--;
                }
                if (world[NS[1].y][NS[1].x] == 2) {
                    NS[1].score += 10;
                }
                if (world[NS[1].y][NS[1].x] == 3) {
                    NS[1].score += 5;
                }
                if (world[NS[1].y][NS[1].x] == 4) {
                    NS[1].score += 1;
                }
                world[NS[1].y][NS[1].x] = 0;
                io.emit('move_Ninja2', NS[1], ninjas, controlsDict[3])
            }
            if (NS[2].name == user) {
                if (world[NS[2].y - 1][NS[2].x] != 1) {
                    ninjaman3.y--;
                }
                if (world[NS[2].y][NS[2].x] == 2) {
                    NS[2].score += 10;
                }
                if (world[NS[2].y][NS[2].x] == 3) {
                    NS[2].score += 5;
                }
                if (world[NS[2].y][NS[2].x] == 4) {
                    NS[2].score += 1;
                }
                world[NS[2].y][NS[2].x] = 0;
                io.emit('move_Ninja3', NS[2], ninjas, controlsDict[3])
            }
            if (NS[3].name == user) {
                if (world[NS[3].y - 1][NS[3].x] != 1) {
                    ninjaman4.y--;
                }
                if (world[NS[3].y][NS[3].x] == 2) {
                    NS[3].score += 10;
                }
                if (world[NS[3].y][NS[3].x] == 3) {
                    NS[3].score += 5;
                }
                if (world[NS[3].y][NS[3].x] == 4) {
                    NS[3].score += 1;
                }
                world[NS[3].y][NS[3].x] = 0;
                io.emit('move_Ninja4', NS[3], ninjas, controlsDict[3])
            }
        }
            io.emit('build_World', world)
        })

        // DOWN........................................................................................................................

        socket.on('down', function (user) {
            if (ninjas[3]) {
            if (NS[0].name == user) {
                console.log(user, 'look')
                if (world[NS[0].y + 1][NS[0].x] != 1) {
                    ninjaman1.y++;
                }
                if (world[NS[0].y][NS[0].x] == 2) {
                    NS[1].score -= 10;
                    console.log(NS[0].score)
                }
                if (world[NS[0].y][NS[0].x] == 3) {
                    NS[0].score += 5;
                    console.log(NS[0].score)
                }
                if (world[NS[0].y][NS[0].x] == 4) {
                    NS[0].score += 1;
                    console.log(NS[0].score)
                }
                world[NS[0].y][NS[0].x] = 0;
                io.emit('move_Ninja1', NS[0], ninjas, controlsDict[4])
            }
            if (NS[1].name == user) {
                if (world[NS[1].y + 1][NS[1].x] != 1) {
                    ninjaman2.y++;
                }
                if (world[NS[1].y][NS[1].x] == 2) {
                    NS[1].score += 10;
                }
                if (world[NS[1].y][NS[1].x] == 3) {
                    NS[1].score += 5;
                }
                if (world[NS[1].y][NS[1].x] == 4) {
                    NS[1].score += 1;
                }
                world[NS[1].y][NS[1].x] = 0;
                io.emit('move_Ninja2', NS[1], ninjas, controlsDict[4])
            }
            if (NS[2].name == user) {
                if (world[NS[2].y + 1][NS[2].x] != 1) {
                    ninjaman3.y++;
                }
                if (world[NS[2].y][NS[2].x] == 2) {
                    NS[2].score += 10;
                }
                if (world[NS[2].y][NS[2].x] == 3) {
                    NS[2].score += 5;
                }
                if (world[NS[2].y][NS[2].x] == 4) {
                    NS[2].score += 1;
                }
                world[NS[2].y][NS[2].x] = 0;
                io.emit('move_Ninja3', NS[2], ninjas, controlsDict[4])
            }
            if (NS[3].name == user) {
                if (world[NS[3].y + 1][NS[3].x] != 1) {
                    ninjaman4.y++;
                }
                if (world[NS[3].y][NS[3].x] == 2) {
                    NS[3].score += 10;
                }
                if (world[NS[3].y][NS[3].x] == 3) {
                    NS[3].score += 5;
                }
                if (world[NS[3].y][NS[3].x] == 4) {
                    NS[3].score += 1;
                }
                world[NS[3].y][NS[3].x] = 0;
                io.emit('move_Ninja4', NS[3], ninjas, controlsDict[4])
            }
        }
            io.emit('build_World', world)
        })
        io.emit('build_World', world)
        io.emit('move_Ninja1', NS[0], ninjas)
        io.emit('move_Ninja2', NS[1], ninjas)
})

// End of Controls