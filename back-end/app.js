const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const logic = require("./modules/GameLogic");
const err = require("./modules/MoveErrorHandling");

const port = process.env.PORT || 4001;
const indexRouter = require("./routes/index");
const testRouter = require("./routes/test");

const app = express();
// app.use(testRouter);
app.use(indexRouter);


const server = http.createServer(app);

const io = socketIo(server);

const connections = {};
let numberOfConnections = 0;

io.on("connection", socket => {
  console.log(`New player connected; already connected: ${numberOfConnections}`);
  if (numberOfConnections >= 2) { // too many players
    socket.emit('errorOfType', 'toomanyconnections');
    socket.disconnect();
    return;
  }

  // logic.setTimeoutForDisconnect(socket);

  connections[socket.id] = socket;
  numberOfConnections += 1;
  // socket.emit('gameStart', 'You connected!!');

  socket.on('clickOnSquare', data => logic.clickOnSquareHandler(socket, data))

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete connections[socket.id];
    numberOfConnections -= 1;
    logic.resetTheGame();
    if (numberOfConnections > 0)
      socket.broadcast.emit('errorOfType', 'waitforplayer');
  });

  if (numberOfConnections == 1) { // no other players
    // logic.setTimeoutForDisconnect(socket);
    socket.emit('errorOfType', 'waitforplayer');
    return;
  }

  // if (numberOfConnections == 2) // exactly one other player

  // reset timeouts anew
  // logic.resetAllTheDisconnectTimers(connections);

  socket.emit('gameStart', {
    msg: 'You connected with another player, you can now play!',
    whoseTurn: logic.whoseTurn,
    whoAmI: 'O',
    winner: logic.winner,
    squares: logic.squares,
    numberBoard: logic.numberBoard,
  });
  socket.broadcast.emit('gameStart', {
    msg: 'You connected with another player, you can now play!',
    whoseTurn: logic.whoseTurn,
    whoAmI: 'X',
    winner: logic.winner,
    squares: logic.squares,
    numberBoard: logic.numberBoard,
  });
  err.sendResponseToClick(socket, err.noErrorMove());
  err.sendResponseToClick(socket.broadcast, err.noErrorMove());
});

server.listen(port, () => console.log(`Listening on port ${port}`));