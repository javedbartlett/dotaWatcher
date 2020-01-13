import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import Header from './components/Header';
import './styles.css';
import axios from 'axios';
import '@babel/polyfill';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

const Player = (props) => {
  let { id } = useParams();
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios(`/api/players/${id}`);
      setGames(response);
    }
    fetchData();
  }, []);
    return (
        <div className="historyContainer">
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{props.players[id]}</h1>
          </div>
          <div className="siteLink" >
            <a href={`https://www.dotabuff.com/players/${id}`}>Dotabuff</a><span> • </span>
            <a href={`https://www.opendota.com/players/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/player/${id}`}>STRATZ </a>
            </div>
          <div className="historyGamesContainer">
            <div className="matchHistoryTitle">Match History</div>
          {games.data && games.data.map((game, i) => <div className="historyId" key={i}>{game.match_id}</div>)}
          </div>
        </div>
    );
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      players: {},
    };
  }

  componentDidMount() {
    this.loadGames();
    this.loadPlayers();
    this.interval = setInterval(() => {
      this.loadGames();
    }, 5000);

  }

  componentWillUnmount() {
    this.loadGames();
    clearInterval(this.interval);
  }

  async loadGames() {
    const response = await fetch('/api/games');
    const myJson = await response.json();
    const sortedJson = myJson.sort((a, b) =>
      a.spectators > b.spectators ? -1 : 1,
    );
    this.setState({ games: sortedJson });
    console.log('updating')
  }

  async loadPlayers() {
    const response = await fetch('/api/playersList');
    const myJson = await response.json();
    this.setState({ players: myJson });
  }

  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <GameList players={this.state.players} data={this.state.games} />
          </Route>
          <Route exact path="/players/:id">
            <Player players={this.state.players} />
          </Route>
        </Switch>
        </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));