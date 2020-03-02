const err = require('./MoveErrorHandling') 

class GameLogic {
  static whoseTurn = 'X';
  static squares = Array(9).fill(null);
  static numberBoard = Array(9).fill(5);
  static winner = false;

  static calculateWinner(squares) {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  static clickOnSquareHandler(socket, data) {
    // console.log(data);
    if (!err.moveIsValidHandler(data, this.squares, this.numberBoard, this.winner, socket)) {
      return;
    }
    // @TODO
    // move is valid, so we move the move, update the states and emit the new board configuration..
  }
}

module.exports = GameLogic;