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
      squares: this.props.playSquares,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      whoseTurn: nextProps.whoseTurn,
      whoAmI: nextProps.whoAmI,
      winner: nextProps.winner,
      squares: nextProps.playSquares,
    };
  }

  render() {
    return (
      <div>
        <Status whoseTurn={this.state.whoseTurn} whoAmI={this.state.whoAmI} winner={this.state.winner}/>
        <div className="game">
          <div className="game-board">
            <Board  whoseTurn={this.state.whoseTurn} 
                    whoAmI={this.state.whoAmI} 
                    winner={this.state.winner}
                    squares={this.state.playSquares}/>
          </div>
        </div>
      </div>
    );
  }
}