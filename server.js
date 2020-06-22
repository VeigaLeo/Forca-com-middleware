var express = require('express')();
var http = require('http').createServer(express);
var io = require('socket.io')(http);

let players = [];
let maxPlayer = 2;
let currentPlayer = 0;
let totalPlayersPlaying = 0;

io.on('connection', (socket) => {
    if(totalPlayersPlaying <= 3){
      players.push({playerId: currentPlayer, socketId: socket.id, score: 0});
      socket.broadcast.to(socket.id).emit('registerplayer', { playerId: totalPlayersPlaying + 1 });

      if(totalPlayersPlaying < 3){
        totalPlayersPlaying += 1;
      }
    }
  
    socket.on('foundletter', (socket) =>{
      const socketPlayerId = socket.socketId;
    
      for(let i=0; i<players.length; i++){
        if(players[i].socketId === socketPlayerId){
          players[i].score =+ 500;
        }
      } 
  
      io.sockets.emit('updatescoreboard', players);
    });
  
    socket.on('nextplayer', (socket) => {
      if(currentPlayer === maxPlayer){
        currentPlayer = 0;
        io.sockets.emit('nextplayer', currentPlayer);
      }else{
        currentPlayer =+ 1;
        io.sockets.emit('nextplayer', currentPlayer);
      }
    });
  });
  
  http.listen(5000, () => {
    console.log('Forca rodando na porta 5000');
  });
  