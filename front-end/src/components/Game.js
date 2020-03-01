import React from 'react'
import {Board} from './Board'
import {Status} from './Status'

export class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Status whoseTurn={this.props.whoseTurn} whoAmI={this.props.whoAmI} winner={this.props.winner}/>
        <div className="game">
          <div className="game-board">
            <Board  whoseTurn={this.props.whoseTurn} 
                    whoAmI={this.props.whoAmI} 
                    winner={this.props.winner}/>
          </div>
        </div>
      </div>
    );
  }
}