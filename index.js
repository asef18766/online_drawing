const express = require('express');
const app = express();
// 加入這兩行
const server = require('http').Server(app);
const io = require('socket.io')(server);
var map = [];
const mapH = 20;
const mapW = 40;
const fs = require('fs');
var online = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static(__dirname + '/views'));

fs.readFile(__dirname + "/data", (e, d) => {
    if (e) {
        console.log(e);

        for (let i = 0; i < mapH; i++) {
            map[i] = [];
            for (let j = 0; j < mapW; j++) {
                map[i][j] = "#ffffff";
            }
        }
    } else map = JSON.parse(d);
});

// 當發生連線事件
io.on('connection', (socket) => {
    online++;
    console.log('Players: ' + online);

    // 當發生離線事件
    socket.on('disconnect', () => {
        online--;
        console.log('Players: ' + online);
    });

    socket.emit("map", map);

    socket.on("draw", a => {
        if (!Array.isArray(a) || a.length < 3) return;
        let y = a[0];
        let x = a[1];
        let color = a[2];
        if (!Number.isInteger(x) || !Number.isInteger(y) || y < 0 || y >= mapH || x < 0 || x >= mapW) return;
        if (map[y][x] == color) return;
        map[y][x] = color;
        fs.writeFile(__dirname + "/data", JSON.stringify(map), e => { if (e) console(e) });
        io.emit("draw", a);
    });
});

// 注意，這邊的 server 原本是 app
server.listen(80, () => {
    console.log("Server Started. http://localhost:80");
});