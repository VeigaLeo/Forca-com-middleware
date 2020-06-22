var socket = io('http://localhost:5000');

socket.on('connect', function(){
    console.log(socket.id);
});

socket.on('newplayer', function(data){
    toastr.success('Novo jogador!', 'Jogador ' + data.playerId + ' entrou na partida!');
});

socket.on('disconnect', function(){
    toastr.error('Jogador desconectado!', '');
});