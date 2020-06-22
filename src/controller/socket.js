var socket = io('http://localhost:5000');

socket.on('connect', function(){
    console.log(socket.id);
});

socket.on('event', function(data){
    console.log(data);
});

socket.on('newplayer', function(data){
    console.log(data);
});

socket.on('disconnect', function(){

});