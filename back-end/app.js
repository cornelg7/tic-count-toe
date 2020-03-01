const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const indexRouter = require("./routes/index");

const app = express();
app.use(indexRouter);

const server = http.createServer(app);

const io = socketIo(server);

const connections = {};
let numberOfConnections = 0;

io.on("connection", socket => {
  console.log(`New player connected; already connected: ${numberOfConnections}`);
  if (numberOfConnections >= 2) { // too many players
    socket.emit('errorOfType', 'toomanyconnections');
    return;
  }

  connections[socket.id] = socket;
  numberOfConnections += 1;
  // socket.emit('gameStart', 'You connected!!');

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete connections[socket.id];
    numberOfConnections -= 1;
    if (numberOfConnections > 0)
      socket.broadcast.emit('errorOfType', 'waitforplayer');
  });

  if (numberOfConnections == 1) { // no other players
    socket.emit('errorOfType', 'waitforplayer');
    return;
  }

  // if (numberOfConnections == 2) // exactly one other player
  socket.emit('gameStart', {
    msg: 'You connected with another player, you can now play!',
    whoseTurn: 'X',
    whoAmI: 'O',
    winner: false,
    squares: Array(9).fill(null),
    numberBoard: Array(9).fill(2),
  });
  socket.broadcast.emit('gameStart', {
    msg: 'You connected with another player, you can now play!',
    whoseTurn: 'X',
    whoAmI: 'X',
    winner: false,
    squares: Array(9).fill(null),
    numberBoard: Array(9).fill(2),
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));