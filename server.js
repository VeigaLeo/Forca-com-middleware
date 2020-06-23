var express = require('express')();
var http = require('http').createServer(express);
var io = require('socket.io')(http);

// Array para organizar os jogadores
let players = [];

// Vez do jogador na fila
let currentPlayer = 0;

// Número de jogadores
let totalPlayersPlaying = 0;

// Palavras da rodada atual
let currentWords = [];

// Prêmio atual
let currentAward = 0;

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

      io.emit('updatescoreboard', players);
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
  
      io.emit('updatescoreboard', players);
    });
  
    /**
     * Método para enviar informação para todos os conectados do socket para passar a vez para
     * o próximo usuário da fila.
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('nextplayer', (player) => {
      if(players[currentPlayer + 1] !== null && players[currentPlayer + 1] !== undefined){
        currentPlayer += 1;
        
        io.emit('nextplayer', players[currentPlayer].playerId);
      }else{
        currentPlayer = 0;

        io.emit('nextplayer', players[0].playerId);
      }
    });

    /**
     * Método retorna todos os jogadores
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('getallplayers', (player) => {
      io.to(socket.id).emit('getallplayers', players);
    });

    /**
     * Método retorna as palavras da rodada atual
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('getcurrentwords', (words) => {
      io.to(socket.id).emit('getcurrentwords', currentWords);
    });

    /**
     * Atualiza as palavras da rodada atual
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('setnewwords', (words) => {
      currentWords = words;
    });

    /**
     * Método retorna a premiação da rodada atual
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('getcurrentaward', (award) =>{
      io.emit('getcurrentaward', currentAward);
    });

    /**
     * Atualiza a premiação da rodada
     * 
     * @author Guilherme Martin
     * @author Leonardo Veiga
     */
    socket.on('setnewaward', (award) => {
      currentAward = award;
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
  