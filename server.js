var http = require("http");
var url = require('url');
var fs = require('fs');
var io=require('socket.io');
var express = require('express');
var app = express();

var user_list=[];

//fs.readFile()...    read file from storge(WIP)

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname+"/index/index.html");
    app.use(express.static(__dirname+'/index'));
});

app.get('/register.html', function (req, res) {
    res.sendFile(__dirname+"/register/register.html");
    app.use(express.static(__dirname+'/register'));
});

var server=http.createServer(app);
server.listen(8001);
var serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket) {
    console.log("server satarted");
    socket.emit('server_message', {message:'hello client'});
    socket.on("client_message",(_data)=>{console.log("client_message:"+_data.message);})

    socket.on("user_verify",(_data)=>{
        //check if data is in the user list
        var flag=false;
        for(var i=0;i<user_list.length;++i)
            if(user_list[i].email==_data.email&&user_list[i].password==user_list.password)
            {
                flag=true;
                socket.emit("verification",true);
                break;
            }
        if(!flag)
            socket.emit("verification",false);
    })
});