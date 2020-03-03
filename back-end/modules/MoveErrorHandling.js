class MoveErrorHandling {
  static moveErrorMessageTypes = {
    numberBoardIsZero: 'Invalid move.. The number board is 0 there!',
    outOfTurn: 'It\'s not your turn yet..',
    winnerAlreadyDecided: 'The game is over already!',
    youWin: 'You Won!!',
    youLose: 'You Lost..',
  };
  static noErrorMove() {
    return {moveError: {error: false, msg: ''}}
  }
  static errorMove(msg) {
    return {moveError: {error: true, msg: msg}}
  }

  static sendResponseToClick(socket, errorObject) {
    socket.emit('responseForClick', errorObject);
  }

  // @TODO returns true if move is valid; otherwise it sends error message.
  // data is {'whereClicked': i, 'whoClicked': this.state.whoAmI}
  static moveIsValidHandler(data, whoseTurn, squares, prevSquares, prevMoveWasAtPos, numberBoard, winner, socket) {
    if (winner) {
      this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.winnerAlreadyDecided));
      return false;
    }
    if (whoseTurn != data.whoClicked) { // click when not your turn
      this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.outOfTurn));
      return false;
    }
    if (numberBoard[data.whereClicked] <= 0) { // click when numberboard is zero
      this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.numberBoardIsZero));
      return false;
    }
    //if (squares[i] )

    // this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.two));

    this.sendResponseToClick(socket, this.noErrorMove());
    return true;
  }
}

module.exports = MoveErrorHandling;