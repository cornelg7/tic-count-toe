import React from 'react'

export class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {whoseTurn, whoAmI, winner} = this.props;
    // let nextPlayerStatus = `; Next player is ${whoseTurn}`;
    let nextPlayerStatus = ``;
    let status = `You are ${whoAmI}${winner ? `; Winner is ${winner}!` : nextPlayerStatus}`;

    return (
      <div className="status">
        {status}
      </div>
    );
  }
}