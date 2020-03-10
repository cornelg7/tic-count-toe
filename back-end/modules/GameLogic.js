const err = require('./MoveErrorHandling');

function randIntBetween(x, y) { // inclusive
  return x + Math.floor(Math.random() * y);
}

class GameLogic {
  static whoseTurn = 'X';
  static squares = Array(9).fill(null);
  static prevSquares = Array(9).fill(null);
  static prevMoveWasAtPos = -1;
  static numberBoard = this.randomBoardNumber();
  static winner = false;
  static oneByOneGameMode = false;
  static whoClickedAlready = [];
  static dataForConcurrentMoves = [];
  static disconnectTimeout = {};
  static TIMEOUT_TIME = 1 * 10 * 1000; // 10 minutes

  static disconnectSocket(socket) {
    // err.sendResponseToClick(socket, err.errorMove(err.moveErrorMessageTypes.disconnectedDueInactivity));
    socket.emit('errorOfType', 'inactivity');
    delete this.disconnectTimeout[socket.id];
    socket.disconnect();
  }

  static setTimeoutForDisconnect(socket) {
    this.disconnectTimeout[socket.id] = setTimeout(() => this.disconnectSocket(socket), this.TIMEOUT_TIME);
  }

  static resetTheDisconnectTimer(socket) {
    clearTimeout(this.disconnectTimeout[socket.id]);
    delete this.disconnectTimeout[socket.id];
    this.setTimeoutForDisconnect(socket);
  }

  static resetAllTheDisconnectTimers(sockets) {
    for (const [id, socket] of Object.entries(sockets)) {
      this.resetTheDisconnectTimer(socket);
    }
  }

  static randomBoardNumber(maxNumberInNumberBoard = 6) {
    let toR = Array(9).fill(0);
    // pick random square for a chance to be 0
    const rsquare = randIntBetween(0, 8);
    toR[rsquare] = randIntBetween(0, maxNumberInNumberBoard - 1);
    // all other squares are rand 1-maxNumberInNumberBoard
    [...Array(9).keys()].filter(e => e !== rsquare).forEach(e => {
      toR[e] = randIntBetween(1, maxNumberInNumberBoard)
    });
    return toR;
  }

  static resetTheGame() {
    this.whoseTurn = 'X';
    this.squares = Array(9).fill(null);
    this.prevSquares = Array(9).fill(null);
    this.prevMoveWasAtPos = -1;
    this.numberBoard = this.randomBoardNumber();
    this.winner = false;
    this.whoClickedAlready = [];
    this.dataForConcurrentMoves = [];
    for (let t in this.disconnectTimeout)
      delete this.disconnectTimeout[t];
  }

  static calculateWinner(squares, prevSquares = this.prevSquares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let toR = [];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        if (this.oneByOneGameMode) {
          // if no more moves == instant win
          let numSum = this.numberBoard.reduce((acc, e) => acc + e);
          if (numSum === 0)
            return squares[a];
          if(prevSquares[a] === squares[a] && prevSquares[a] && prevSquares[a] === prevSquares[b] && prevSquares[a] === prevSquares[c]) {
            // console.log(prevSquares);
            // console.log(squares);
            return squares[a];
          }
        }
        else {
          toR.push(squares[a]);
        }
      }
    }

    if (this.oneByOneGameMode) {
      return false;
    }
    else {
      if (toR.length === 1) {
        return toR[0];
      }
      else {
        return false;
      }
    }
  }
  
  // data is {'whereClicked': i, 'whoClicked': this.state.whoAmI}
  static oneByOneClickOnSquareHandler(socket, data) {
    // console.log(data);
    if (!err.oneByOneMoveIsValidHandler(data, this.whoseTurn, this.squares, this.prevSquares, 
                                this.prevMoveWasAtPos,
                                this.numberBoard, this.winner, socket)) {
      return;
    }

    // update prev
    this.prevSquares = this.squares.slice();
    this.prevMoveWasAtPos = data.whereClicked;

    // make current move
    this.squares[data.whereClicked] = data.whoClicked;
    this.numberBoard[data.whereClicked] -= 1;

    // check for winner
    this.winner = this.calculateWinner(this.squares, this.prevSquares);
    
    // next player should move
    this.whoseTurn = this.whoseTurn === 'X' ? 'O' : 'X';

    // emit the new board configuration..
    let toSend = {
      whoseTurn: this.whoseTurn,
      winner: this.winner,
      squares: this.squares,
      numberBoard: this.numberBoard,
    }
    socket.emit('gameUpdate', toSend);
    socket.broadcast.emit('gameUpdate', toSend);
    // emit to clear the move errors
    err.sendResponseToClick(socket, err.noErrorMove());
    err.sendResponseToClick(socket.broadcast, err.noErrorMove());
  }

  static resolveMovesForConcurrent(socket) {
    let toSend = {};
    let updateMessageNoError = ``;
    if (this.dataForConcurrentMoves[0].whereClicked === this.dataForConcurrentMoves[1].whereClicked) {
      // both players clicked on the same square, decrease number board
      this.numberBoard[this.dataForConcurrentMoves[0].whereClicked] -= 1;
      updateMessageNoError = `You both chose the same square #${this.dataForConcurrentMoves[0].whereClicked}!`;
    }
    else {
      // make current move
      for (let d of this.dataForConcurrentMoves) {
        this.squares[d.whereClicked] = d.whoClicked;
        this.numberBoard[d.whereClicked] -= 1;
      }
      // check for winner
      this.winner = this.calculateWinner(this.squares);
      // update messages
      let xchose = this.dataForConcurrentMoves[0].whoClicked === 'X'
                   ? this.dataForConcurrentMoves[0].whereClicked
                   : this.dataForConcurrentMoves[1].whereClicked;
      let ochose = this.dataForConcurrentMoves[0].whoClicked === 'O'
                  ? this.dataForConcurrentMoves[0].whereClicked
                  : this.dataForConcurrentMoves[1].whereClicked;
      updateMessageNoError = `X chose square #${xchose}; O chose square #${ochose}`;
    }
    this.dataForConcurrentMoves = [];
    this.whoClickedAlready = [];
    toSend = {
      whoseTurn: this.whoseTurn,
      winner: this.winner,
      squares: this.squares,
      numberBoard: this.numberBoard,
    }
    socket.emit('gameUpdate', toSend);
    socket.broadcast.emit('gameUpdate', toSend);
    // emit update messages
    err.sendResponseToClick(socket, err.noErrorMove(updateMessageNoError));
    err.sendResponseToClick(socket.broadcast, err.noErrorMove(updateMessageNoError));
  }

  static concurrentClickOnSquareHandler(socket, data) {
    // console.log(data);
    if (!err.concurrentMoveIsValidHandler(data, this.whoseTurn, this.squares, this.prevSquares, 
      this.prevMoveWasAtPos,
      this.numberBoard, this.winner, socket,
      this.whoClickedAlready)) {
      return;
    }
    this.whoClickedAlready.push(data.whoClicked);
    this.dataForConcurrentMoves.push(data);
    // if both players chose their moves, resolve the moves
    if (this.whoClickedAlready.includes('X') && this.whoClickedAlready.includes('O')) {
      this.resolveMovesForConcurrent(socket);
    }
    else {
      err.sendResponseToClick(socket, err.noErrorMove(`You chose square #${data.whereClicked}! Waiting for the other player to choose..`));
    }
  }

  // data is {'whereClicked': i, 'whoClicked': this.state.whoAmI}
  static clickOnSquareHandler(socket, data) {
    // this.resetTheDisconnectTimer(socket);
    if (this.oneByOneGameMode) {
      this.oneByOneClickOnSquareHandler(socket, data);
      return;
    }
    this.concurrentClickOnSquareHandler(socket, data);
  }
}

module.exports = GameLogic;