const err = require('./MoveErrorHandling') 

class GameLogic {
  static whoseTurn = 'X';
  static squares = Array(9).fill(null);
  static prevSquares = Array(9).fill(null);
  static prevMoveWasAtPos = -1;
  static numberBoard = Array(9).fill(5);
  static winner = false;

  static resetTheGame() {
    this.whoseTurn = 'X';
    this.squares = Array(9).fill(null);
    this.prevSquares = Array(9).fill(null);
    this.prevMoveWasAtPos = -1;
    this.numberBoard = Array(9).fill(5);
    this.winner = false;
  }

  static calculateWinner(squares, prevSquares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (prevSquares[a] && prevSquares[a] === prevSquares[b] && prevSquares[a] === prevSquares[c]) {
        if(prevSquares[a] === squares[a] && squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          // console.log(prevSquares);
          // console.log(squares);
          return squares[a];
        }
      }
    }
    return false;
  }
  
  // data is {'whereClicked': i, 'whoClicked': this.state.whoAmI}
  static clickOnSquareHandler(socket, data) {
    // console.log(data);
    if (!err.moveIsValidHandler(data, this.whoseTurn, this.squares, this.prevSquares, 
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
}

module.exports = GameLogic;