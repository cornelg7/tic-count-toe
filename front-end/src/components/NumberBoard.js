import React from 'react'

function Square(props) {
  return (
    <button className="square">
      {props.value}
    </button>
  );
}

export class NumberBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberBoard: this.props.numberBoard,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
     numberBoard: nextProps.numberBoard,
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.numberBoard[i]}
      />
    );
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
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
      </div>
    );
  }
}