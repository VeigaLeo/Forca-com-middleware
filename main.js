var express = require('express')();
var http = require('http').createServer(express);
var io = require('socket.io')(http);
const { app, BrowserWindow } = require("electron");

let players = [];
let maxPlayer = 2;
let currentPlayer = 0;
let totalPlayersPlaying = 0;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("./src/public/index.html");

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

io.on('connection', (socket) => {
  if(totalPlayers <= 3){
    players.push({playerId: currentPlayer, socketId: socket.id, score: 0});
    socket.broadcast.emit('registerplayer', { playerId: totalPlayers });

    if(totalPlayers < 3){
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

