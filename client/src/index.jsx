import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import Header from './components/Header';
import { heroesList, localizedList } from './heroList.js';
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
            <div className="matchHistoryTitle">Match History <br/>(Under Construction :P)</div>
          {games.data && games.data.map((game, i) => <div className="historyId" key={i}>{game.match_id}</div>)}
          </div>
        </div>
    );
}

const Heroes = (props) => {
  let { id } = useParams();
  // let { fromNotifications } = props.match;
  const [games, setGames] = useState([]);
  console.log(useParams());

  useEffect(() => {
    async function fetchData() {
      const response = await axios(`/api/heroes/${id}`);
      setGames(response);
    }
    fetchData();
  }, []);
    return (
        <div className="historyContainer">
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{heroesList[id]}</h1>
          </div>
          <div className="heroImageContainer">
            {/* <video autoPlay poster="true" loop muted>
              <source src="https://stratz.com/chaos-knight.da3d3642.webm" type="video/webm" />
              </video> */}
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[id].replace('npc_dota_hero_', '')}_full.png`}/>
          </div>
          <div className="siteLink" >
            <a href={`https://www.opendota.com/heroes/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/heroes/${id}`}>STRATZ </a>
            </div>
            <div></div>
          <div className="historyGamesContainer">
            <div className="matchHistoryTitle">Match History <br/>(Under Construction :P)</div>
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
          <Route exact path="/heroes/:id">
            <Heroes players={this.state.players} />
          </Route>
        </Switch>
        </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));