import React from 'react'

function Message(props) {
  let msg = 'Something went wrong and it\'s your fault';
  if (props.errorType === 'server')
    msg = 'Something went wrong with the server.';
  else if (props.errorType === 'toomanyconnections')
    msg = 'There are already two players playing. Try connecting later..';
  else if (props.errorType === 'waitforplayer')
    msg = 'Waiting for another player..';
  else if (props.errorType === 'inactivity')
    msg = 'Disconnected from server due to inactivity..';
  
  return (
    <p>
      {msg}
    </p>
  );
}

export class Error extends React.Component {
  render() {
    return (
      <div>
        <Message errorType={this.props.errorType} />
      </div>
    );
  }
}