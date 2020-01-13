import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import Header from './components/Header';
import { heroesList, localizedList, newHeroes } from './heroList.js';
import './styles.css';
import axios from 'axios';
import { timeSince2 } from './timeSince.js';
import cheerio from 'cheerio';
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
  const [player, setPlayerData] = useState({ data: null, image: null });
  useEffect(() => {

    const fetchData = async () => {
      const response1 = await axios(`/api/players/${id}`);
      const response2 = await axios(`/api/playerImage/${id}`)
      setPlayerData({ data: response1.data, image: response2.data });
    };

    fetchData();
  }, []);
    return (
        <div className="historyContainer">
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{props.players[id]}</h1>
          </div>
          <div className="heroImageContainer">
            {/* <img src={`${player.image}`}/> */}
          </div>
          <div className="siteLink" >
            <a href={`https://www.dotabuff.com/players/${id}`}>Dotabuff</a><span> • </span>
            <a href={`https://www.opendota.com/players/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/player/${id}`}>STRATZ </a>
            </div>
          <div className="historyGamesContainer">
            <div className="matchHistoryTitle">Match History</div>
          {player.data && player.data.map((game, i) => <div className="historyId" key={i}>
              <img className="minimapIcon" src={ (game.players.find(player => player.account_id === +id).hero_id == 128 || game.players.find(player => player.account_id === +id).hero_id == 126) ?
              newHeroes[game.players.find(player => player.account_id === +id).hero_id] : `http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[game.players.find(player => player.account_id === +id).hero_id].replace('npc_dota_hero_', '')}_icon.png`}/>
            <span className="historyStats">{game.match_id}{" "}•{" "}{timeSince2(game.updatedAt)}{" "}•{" "}{game.average_mmr} avg MMR</span></div>)}
          </div>
        </div>
    );
}

const Heroes = (props) => {
  let { id } = useParams();

  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios(`/api/heroes/${id}`);
      await setGames(response);
      games.sort((a, b) =>
      a.updatedAt > b.updatedAt ? -1 : 1,
    );
    }
    fetchData();
  }, []);
    return (
        <div className="historyContainer">
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{heroesList[id]}</h1>
          </div>
          <div className="heroImageContainer">
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[id].replace('npc_dota_hero_', '')}_full.png`}/>
          </div>
          <div className="siteLink" >
            <a href={`https://www.opendota.com/heroes/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/heroes/${id}`}>STRATZ </a>
            </div>
            <div></div>
          <div className="historyGamesContainer">
            <div className="matchHistoryTitle">Match History</div>
            <div className="introMessage">{heroesList[id]} has been picked by pros {games.data && games.data.length} times in the last 2 weeks</div>
          {games.data && games.data.map((game, i) => <div className="historyId" key={i}>
          <img className="minimapIcon" src={ (id == 128 || id == 126) ? newHeroes[id] : `http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[id].replace('npc_dota_hero_', '')}_icon.png`}/>{"  "}
          <span className="historyStats">{game.match_id}{" "}•{" "}{timeSince2(game.updatedAt)}{" "}•{" "}{game.average_mmr} avg MMR</span></div>)}
          </div>
        </div>
    );
}

const SearchBar = (props) => {

  return (
    <div className="searchBoxContainer">
    <input className="searchBox" placeholder="Search for player or hero" type="textbox" />
    </div>
  )
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
        <SearchBar />
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