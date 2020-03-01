import React from 'react'

export class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {whoseTurn, whoAmI, winner} = this.props;
    let status = `You are ${whoAmI}; ${winner ? `Winner is ${winner}!` : `Next player is ${whoseTurn}`}`;

    return (
      <div className="status">
        {status}
      </div>
    );
  }
}