var socket = io('http://localhost:5000');

socket.on('connect', function(socket){});
socket.on('disconnect', function(){});

socket.on('updatescoreboard', function(players){
    let scoreBoard = players.sort(function(a,b) {
        return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
    });

    for(let i=0; i<players.length; i++){
        if(i === 0) $('#numberOnePlayerScore').text('Posição 1 - Jogador: ' + scoreBoard[0].playerId + " - " + scoreBoard[0].score);
        if(i === 1) $('#numberTwoPlayerScore').text('Posição 2 - Jogador: ' + scoreBoard[1].playerId + " - " + scoreBoard[1].score);
        if(i === 2) $('#numberThreePlayerScore').text('Posição 3 - Jogador: ' + scoreBoard[2].playerId + " - " + scoreBoard[2].score);
    }   
});

socket.on('successregisternewplayer', function(newPlayer){
    uniqueId = newPlayer.uniqueId;
    playerId = newPlayer.playerId;
    
    players.push({ 
        playerId: newPlayer.playerId, 
        socketId: newPlayer.id, 
        uniqueId: newPlayer.uniqueId, 
        score: 0 
    });

    toastr.success('Registro efetuado', 'Sucesso em efetuar o registro, bom jogo!');
});

socket.on('alreadyregisterplayer', function(player){
    uniqueId = player.uniqueId;
    playerId = player.playerId;

    toastr.info('Usuário já cadastrado', 'Não é necessário efetuar o registro novamente.')
});

socket.on('nextplayer', function(currentPlayerId){
    currentPlayerIdQueue = currentPlayerId;
});