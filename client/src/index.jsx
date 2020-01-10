import React from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import "./styles.css";
import "@babel/polyfill";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      players:{},
    };
  }

  componentDidMount() {
    this.loadGames()
    this.loadPlayers();
    this.interval = setInterval(this.loadgames, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async loadGames() {
    const response = await fetch("/api/games");
    const myJson = await response.json();
    const sortedJson =
    myJson.sort((a, b) => (a.spectators > b.spectators) ? -1 : 1)
    this.setState({games: sortedJson});
  }

  async loadPlayers() {
    const response = await fetch("/api/players");
    const myJson = await response.json();
    this.setState({players: myJson});
  }


  render() {
    return (
      <div>
        <h1 className="title">Dota Player Tracker</h1>
        <div className="container">
        <GameList players={this.state.players} data={this.state.games} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));