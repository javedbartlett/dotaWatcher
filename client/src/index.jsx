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

  async loadGames() {
    const response = await fetch("/api/games");
    const myJson = await response.json();
    this.setState({games: myJson});
  }

  async loadPlayers() {
    const response = await fetch("/api/players");
    const myJson = await response.json();
    this.setState({players: myJson});
  }

  componentDidMount() {
    this.loadGames();
    this.loadPlayers();
  }

  render() {
    return (
      <div>
        <h1>Dota Player Tracker</h1>
        <GameList players={this.state.players} data={this.state.games} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));