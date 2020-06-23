var express = require('express')();
var http = require('http').createServer(express);
var io = require('socket.io')(http);

let players = [];
let currentPlayer = 0;
let totalPlayersPlaying = 0;

/**
 * Método principal para manipular conexões do socket.io
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
io.on('connection', (socket) => {
  
  /**
   * Método para registrar novo jogador, caso já tenha um jogador existente
   * com o mesmo id fornecido pelo usuário, retorna os detalhes do jogador 
   * já existente.
   * 
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */  
  socket.on('registernewplayer', (newPlayer) => {
      const found = players.find(element => element.uniqueId === newPlayer.uniqueId);
      
      if(!found){
        let player = {
          playerId: currentPlayer, 
          socketId: newPlayer.id, 
          uniqueId: newPlayer.uniqueId, 
          score: 0
        };

        players.push(player);
        totalPlayersPlaying += 1;

        io.to(socket.id).emit('successregisternewplayer', player);
      }else{
        io.to(socket.id).emit('alreadyregisterplayer', found);
      }
    })
  
    /**
     * Método para enviar a informação para todos os conectados do socket, que foi encontrado
     * uma letra que condiz com as palavras secretas.
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('foundletter', (user) =>{
      const socketUniqueId = user.uniqueId;
    
      for(let i=0; i<players.length; i++){
        if(players[i].uniqueId === socketUniqueId){
          players[i].score =+ 500;
        }
      } 
  
      socket.broadcast.emit('updatescoreboard', players);
    });
  
    /**
     * Método para enviar informação para todos os conectados do socket para passar a vez para
     * o próximo usuário da fila.
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('nextplayer', (player) => {
      if(player[currentPlayer + 1] !== null){
        currentPlayer += 1;
        
        socket.broadcast.emit('nextplayer', player[currentPlayer].playerId);
      }else{
        currentPlayer = 0;

        socket.broadcast.emit('nextplayer', player[0].playerId);
      }
    });
  });
  
  /**
   * Método principal do express para rotear o servidor na porta 5000
   * 
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  http.listen(5000, () => {
    console.log('Forca rodando na porta 5000');
  });
  