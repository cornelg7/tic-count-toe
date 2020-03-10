class MoveErrorHandling {
  static moveErrorMessageTypes = {
    numberBoardIsZero: 'Invalid move.. The number board is 0 there!',
    outOfTurn: 'It\'s not your turn yet..',
    moveAlreadyChosen: 'You already chose your move..',
    winnerAlreadyDecided: 'The game is over already! Refresh the page!',
    youWin: 'You Won!!',
    youLose: 'You Lost..',
    disconnectedDueInactivity: 'You were disconnected due to inactivity. Refresh the page.',
  };
  static noErrorMove(msg = ``) {
    return {moveError: {error: false, msg: msg}}
  }
  static errorMove(msg) {
    return {moveError: {error: true, msg: msg}}
  }

  static sendResponseToClick(socket, errorObject) {
    socket.emit('responseForClick', errorObject);
  }

  // @TODO returns true if move is valid; otherwise it sends error message.
  // data is {'whereClicked': i, 'whoClicked': this.state.whoAmI}
  static oneByOneMoveIsValidHandler(data, whoseTurn, squares, prevSquares, prevMoveWasAtPos,
                                    numberBoard, winner, socket) {
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

  static concurrentMoveIsValidHandler(data, whoseTurn, squares, prevSquares, prevMoveWasAtPos,
                                      numberBoard, winner, socket, whoClickedAlready) {
    if (winner) {
      this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.winnerAlreadyDecided));
      return false;
    }
    // console.log(whoClickedAlready);
    if (whoClickedAlready.includes(data.whoClicked)) { // click when not your turn
      this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.moveAlreadyChosen));
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