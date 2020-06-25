const express = require("express")();
const http = require("http").createServer(express);
const io = require("socket.io")(http);
const words = require("./src/utils/words");

// Array para organizar os jogadores
let players = [];

// Vez do jogador na fila
let currentPlayer = 0;

// Número de jogadores
let totalPlayersPlaying = 0;

// Palavras da rodada atual
let currentWords = [];

// Prêmio atual
let currentAward = Math.floor(Math.random() * 2000);

// Letras já escolhidas da rodada
let chosenLetters = [];

let inactivePlayers = [];

/**
 * Método principal para manipular conexões do socket.io
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
io.on("connection", socket => {
  /**
   * Método para verificar se algum jogador desconectou do jogo
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("disconnect", () => {
    const player = players.find(e => e.socketId === socket.id);
    inactivePlayers.push(player);

    players = players.filter(e => {
      return e.socketId != player.socketId;
    });
    totalPlayersPlaying -= 1;

    io.emit("nextplayer", players[currentPlayer].playerId);
  });

  /**
   * Método vai para a próxima rodada
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("nextround", round => {
    currentWords = [];
    chosenLetters = [];
    currentAward = Math.floor(Math.random() * 2000);

    for (let i = 0; i < 3; i++) {
      currentWords.push(words[Math.floor(Math.random() * words.length)]);
    }

    io.emit("nextround", currentWords);
  });

  /**
   * Método para registrar novo jogador, caso já tenha um jogador existente
   * com o mesmo id fornecido pelo usuário, retorna os detalhes do jogador
   * já existente.
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */

  socket.on("registernewplayer", newPlayer => {
    const found = players.find(
      element => element.uniqueId === newPlayer.uniqueId
    );

    const inactiveFound = inactivePlayers.find(
      element => element.uniqueId === newPlayer.uniqueId
    );

    if (players.length === 0) {
      chosenLetters = [];
      currentAward = Math.floor(Math.random() * 2000);

      for (let i = 0; i < 3; i++) {
        currentWords.push(words[Math.floor(Math.random() * words.length)]);
      }
    }

    if (!found && !inactiveFound) {
      let player = {
        playerId: totalPlayersPlaying,
        socketId: socket.id,
        uniqueId: newPlayer.uniqueId,
        score: 0
      };

      players.push(player);
      totalPlayersPlaying += 1;

      io.to(socket.id).emit("successregisternewplayer", player);
    } else {
      inactivePlayers = inactivePlayers.filter(e => {
        return e.uniqueId != newPlayer.uniqueId;
      });

      players.push(inactiveFound);

      io.to(socket.id).emit("alreadyregisterplayer", inactiveFound);
    }

    io.emit("getcurrentwords", currentWords);
    io.emit("updatescoreboard", players);
  });

  /**
   * Método para enviar a informação para todos os conectados do socket, que foi encontrado
   * uma letra que condiz com as palavras secretas.
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("foundletter", user => {
    const socketUniqueId = user.uniqueId;

    for (let i = 0; i < players.length; i++) {
      if (players[i].uniqueId === socketUniqueId) {
        players[i].score += currentAward;
      }
    }

    io.emit("updatescoreboard", players);
  });

  /**
   * Método para enviar informação para todos os conectados do socket para passar a vez para
   * o próximo usuário da fila.
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("nextplayer", player => {
    if (
      players[currentPlayer + 1] !== null &&
      players[currentPlayer + 1] !== undefined
    ) {
      currentPlayer += 1;

      io.emit("nextplayer", players[currentPlayer].playerId);
    } else {
      currentPlayer = 0;

      io.emit("nextplayer", players[0].playerId);
    }
  });

  /**
   * Método retorna todos os jogadores
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("getallplayers", player => {
    io.to(socket.id).emit("getallplayers", players);
  });

  /**
   * Método retorna as palavras da rodada atual
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("getcurrentwords", words => {
    io.to(socket.id).emit("getcurrentwords", currentWords);
  });

  /**
   * Atualiza as palavras da rodada atual
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("setnewwords", words => {
    currentWords = words;
  });

  /**
   * Método retorna a premiação da rodada atual
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("getcurrentaward", award => {
    io.emit("getcurrentaward", currentAward);
  });

  /**
   * Atualiza a premiação da rodada
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("setnewaward", award => {
    currentAward = award;
    io.emit("getcurrentaward", currentAward);
  });

  /**
   * Inclui no array de letras já escolhidas a letra informada
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("chosenletter", letter => {
    chosenLetters.push(letter);
    io.emit("getchosenletters", chosenLetters);
  });

  /**
   * Recupera as letras já escolhidas da rodada atual
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("getchosenletters", letter => {
    io.emit("getchosenletters", chosenLetters);
  });

  /**
   * Retorna o id do player atual na fila
   *
   * @author Guilherme Martin
   * @author Leonardo Veiga
   */
  socket.on("getcurrentplayerqueue", player => {
    io.emit("getcurrentplayerqueue", currentPlayer);
  });
});

/**
 * Método principal do express para rotear o servidor na porta 5000
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
http.listen(5000, () => {
  console.log("Forca rodando na porta 5000");
});
