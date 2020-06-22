var socket = io('http://localhost:5000');

socket.on('connect', function(){
    // toastr.success('Sucesso ao conectar ao jogo', 'Boa sorte!');
});

socket.on('newplayer', function(data){
    // toastr.success('Novo jogador!', 'Jogador ' + data.playerId + ' entrou na partida!');
});

socket.on('disconnect', function(){
    // toastr.error('Jogador desconectado!', '');
});

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

socket.on('registerplayer', function(newPlayerId){
    playerId = newPlayerId;

    players.push({ playerId: playerId, socketId: socket.id, score: 0 });
});

socket.on('nextplayer', function(currentPlayerId){
    currentPlayer = currentPlayerId;
});