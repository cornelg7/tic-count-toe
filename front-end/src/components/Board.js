import React from 'react';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares:    this.props.squares,
      whoAmI:     this.props.whoAmI,
      whoseTurn:  this.props.whoseTurn,
      socket:     this.props.socket,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      squares:    nextProps.squares,
      whoAmI:     nextProps.whoAmI,
      whoseTurn:  nextProps.whoseTurn,
      socket:     nextProps.socket, 
    };
  }

  // _prev_handleClick(i) {
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  handleClick(i) {
    this.state.socket.emit('clickOnSquare', {'whereClicked': i, 'whoClicked': this.state.whoAmI});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}