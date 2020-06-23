var socket = io('http://localhost:5000');

/**
 * Recebe a informação do servidor do placar atualizado
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
socket.on('updatescoreboard', function(playersScore){
    let scoreBoard = playersScore.sort(function(a,b) {
        return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
    });

    let htmlPlacar = '';

    for(let i=0; i<scoreBoard.length; i++){
       htmlPlacar += '<span>' + scoreBoard[i].uniqueId + ' - ' + scoreBoard[i].score + '</span><br>';
    }   

    players = playersScore;

    $('#anchorJogadores').html(htmlPlacar);
});

/**
 * Recebe a informação do socket.io de sucesso de registro
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
socket.on('successregisternewplayer', function(newPlayer){
    uniqueId = newPlayer.uniqueId;
    playerId = newPlayer.playerId;
    
    players.push({ 
        playerId: newPlayer.playerId, 
        socketId: newPlayer.id, 
        uniqueId: newPlayer.uniqueId, 
        score: 0 
    });

    handlePlayerTurn();

    toastr.success('Registro efetuado', 'Sucesso em efetuar o registro, bom jogo!');
});

/**
 * Recebe a informação do socket.io se um usuário já está cadastrado
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
socket.on('alreadyregisterplayer', function(player){
    uniqueId = player.uniqueId;
    playerId = player.playerId;

    toastr.info('Usuário já cadastrado', 'Não é necessário efetuar o registro novamente.')
});

/**
 * Recebe a informação do socket.io de todos os jogadores
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
socket.on('getallplayers', function(playersServer){
    players = playersServer;
});

/**
 * Recebe a informação do socket.io de quem é o próximo jogador
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
socket.on('nextplayer', function(currentPlayerId){
    currentPlayerIdQueue = currentPlayerId;
});

/**
  * Método retorna as palavras da rodada atual
  * 
  * @author Guilherme Martin
  * @author Leonardo Veiga
  */
socket.on('getcurrentwords', (words) => {
   //TODO RETORNAR AS PALAVRAS E FAZER A LOGICA PARA PREENCHER O QUE JA FOI PREENCHIDO
});
 
/**
 * Método retorna a premiação da rodada atual
 * 
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
socket.on('getcurrentaward', (award) =>{
  $('#currentAward').text(award);
});
 
