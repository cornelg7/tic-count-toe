class MoveErrorHandling {
  static moveErrorMessageTypes = {
    one: 'one ee ',
    two: 'twoooooooooooooooo ',
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
  static moveIsValidHandler(data, squares, numberBoard, winner, socket) {
    this.sendResponseToClick(socket, this.errorMove(this.moveErrorMessageTypes.two));
    // this.sendResponseToClick(socket, this.noErrorMove());
  }
}

module.exports = MoveErrorHandling;