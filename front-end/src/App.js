import React, { Component } from "react";
import {Game} from './components/Game'
import {Error} from './components/Error'
import {NumberBoard} from './components/NumberBoard'
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
        squares: false,
        numberBoard: false,
      },
      error: false,
      errorType: '',
      finishedGame: true,
      socket: false,
      moveError: {
        error: false, 
        msg: '',
      },
      endpoint: "/",
      // endpoint: "http://127.0.0.1:4001",
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint, {secure: true});
    socket.on("gameStart", data => {
      this.setState({ gameData: {...this.state.gameData, ...data},
                      error: false,
                      socket: socket });
    });
    socket.on("gameUpdate", data => {
      this.setState({ gameData: {...this.state.gameData, ...data},
                      error: false,
                      socket: socket });
    });
    socket.on("errorOfType", data => this.setState({ error: true, errorType: data }));
    socket.on('responseForClick', data => this.setState({moveError: data.moveError}));
  }

  render() {
    const { gameData: {msg, whoseTurn, whoAmI, winner, numberBoard, squares}, error, errorType, socket, moveError } = this.state;
    return (
        <div style={{ textAlign: "center" }}>
          {error ? 
            <Error errorType = {errorType}/>
          : <div>
              <p>{msg}</p>

              <Game whoseTurn={whoseTurn}
                    whoAmI={whoAmI}
                    winner={winner}
                    squares={squares}
                    socket={socket}
                    moveError={moveError}/>
              
              <NumberBoard numberBoard={numberBoard} />
            </div>}
        </div>
    );
  }
}

export default App;