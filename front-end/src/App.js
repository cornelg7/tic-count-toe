import React, { Component } from "react";
import {Game} from './components/Game'
import {Error} from './components/Error'
import socketIOClient from "socket.io-client";

// let mySocket;

// function disconnectClient(socket) {
//   socket.disconnect(true);
//   // socket.emit('disconnectMe', 'please');
//   // console.log(`${socket}`)
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameData: {
        msg: false,
        whoseTurn: false,
        whoAmI: false,
      },
      error: false,
      errorType: '',
      finishedGame: true,
      socket: false,
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("gameStart", data => {
      this.setState({ gameData: data,
                      whoseTurn: data.whoseTurn, 
                      whoAmI: data.whoAmI, 
                      error: false,
                      socket: socket });

    });
    socket.on("errorOfType", data => this.setState({ error: true, errorType: data }));
  }

  render() {
    const { gameData: {msg, whoseTurn, whoAmI, winner}, error, errorType } = this.state;
    return (
        <div style={{ textAlign: "center" }}>
          {error ? 
            <Error errorType = {errorType}/>
          : <div>
              <p>{msg}</p>

              <Game whoseTurn={whoseTurn} whoAmI={whoAmI} winner={winner}/>
              
            </div>}
        </div>
    );
  }
}

export default App;