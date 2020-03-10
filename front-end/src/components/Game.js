import React from 'react'
import {Board} from './Board'
import {Status} from './Status'

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whoseTurn: this.props.whoseTurn,
      whoAmI: this.props.whoAmI,
      winner: this.props.winner,
      squares: this.props.squares,
      socket: this.props.socket,
      moveError: this.props.moveError,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      whoseTurn: nextProps.whoseTurn,
      whoAmI: nextProps.whoAmI,
      winner: nextProps.winner,
      squares: nextProps.squares,
      socket: nextProps.socket,
      moveError: nextProps.moveError,
    };
  }

  render() {
    return (
      <div>
        <Status whoseTurn={this.state.whoseTurn}
                whoAmI={this.state.whoAmI}
                winner={this.state.winner}/>
        <div className="game">
          <div className="game-board">
            <Board  whoseTurn={this.state.whoseTurn} 
                    whoAmI={this.state.whoAmI} 
                    winner={this.state.winner}
                    squares={this.state.squares}
                    socket={this.state.socket}/>
          </div>
        </div>
        <div className="status">
          {this.state.moveError.error
          ? <div className="status error-color-highlight"> {this.state.moveError.msg} </div>
          : <div className="status update-color-highlight"> {this.state.moveError.msg} </div>
          } 
      </div>
      </div>
    );
  }
}