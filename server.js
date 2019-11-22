const express = require('express');
const app = express();
app.use(express.static(__dirname + '/static/css'));
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