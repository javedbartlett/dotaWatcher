import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import Header from './components/Header';
import { heroesList, localizedList, newHeroes, heroSearchList, heroSearchList2 } from './heroList.js';
import './styles.css';
import axios from 'axios';
import { timeSince2 } from './timeSince.js';
import cheerio from 'cheerio';
import _ from 'lodash';
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
      const response2 = await axios(`/api/saveImage/${id}`)
      setPlayerData({ data: response1.data, image: response2.data });
    };

    fetchData();
  }, []);
    return (
        <div className="historyContainer">
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{props.players[id]}</h1>
          </div>
          <div className="playerImageContainer">
            {/* <img src={`${player.image}`}/> */}
            {player.image ? <img src={`data:image/jpeg;base64,${player.image && player.image}`}/> : ""}
            {/* {player.image && console.log(player.image[0].img.data.data)} */}
          </div>
          <div className="siteLink" >
            <a href={`https://www.dotabuff.com/players/${id}`}>Dotabuff</a><span> • </span>
            <a href={`https://www.opendota.com/players/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/player/${id}`}>STRATZ </a>
            </div>
          <div className="historyGamesContainer">
            <div className="matchHistoryTitle">Match History</div>
            <div className="minimapOuterContainer">
            <div className="minimapContainer">
          {player.data && player.data.map((game, i) => <div className="historyId" key={i}>
              <img className="minimapIcon" src={ (game.players.find(player => player.account_id === +id).hero_id == 128 || game.players.find(player => player.account_id === +id).hero_id == 126) ?
              newHeroes[game.players.find(player => player.account_id === +id).hero_id] : `http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[game.players.find(player => player.account_id === +id).hero_id].replace('npc_dota_hero_', '')}_icon.png`}/>
            <span className="historyStats">{game.match_id}{" "}•{" "}{timeSince2(game.updatedAt)}{" "}•{" "}{game.average_mmr} avg MMR</span></div>)}
          </div>
          </div>
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
            <div className="minimapOuterContainer">
            <div className="minimapContainer">
          {games.data && games.data.map((game, i) => <div className="historyId" key={i}>
          <img className="minimapIcon" src={ (id == 128 || id == 126) ? newHeroes[id] : `http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[id].replace('npc_dota_hero_', '')}_icon.png`}/>{"  "}
          <span className="historyStats">{game.match_id}{" "}•{" "}{timeSince2(game.updatedAt)}{" "}•{" "}{game.average_mmr} avg MMR</span></div>)}
          </div>
          </div>
          </div>
        </div>
    );
}

// const SearchBar = (props) => {

//   return (
//     <div className="searchBoxContainer">
//     <input className="searchBox" placeholder="Search for player or hero" type="textbox" />
//     </div>
//   )
// }

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      heroes: [],
      players: [],
    };
  }

  handlePlayerSearchInputChange(query){
    let vals = Object.values(this.props.players);
    // console.log(vals)
    this.setState({ players: query.length > 1 ? vals.filter(val => val.toLowerCase().indexOf(query.toLowerCase()) !== -1) :""})
  }


  handleHeroSearchInputChange(query){
    let valsUnfiltered = Object.values(heroSearchList);
    let vals = valsUnfiltered.filter(val => val !== undefined)

     this.setState({ heroes: query.length > 1 ? vals.filter(val => val.toLowerCase().indexOf(query.toLowerCase()) !== -1) :""})
  }

  handleInputChange(e) {
    this.handlePlayerSearchInputChange(e.target.value);
    this.handleHeroSearchInputChange(e.target.value)
    this.setState({
      value: e.target.value
    });
  }

  render() {
    // console.log(this.props.players)
    let playerSearchList = _.invert(this.props.players)
    return (
      <div className="mainInnerContainer">
      <div className="searchBoxContainer">
        <input
          className="searchBox"
          placeholder="Search for a Player or Hero"
          type="text"
          value={this.state.value}
          onChange={this.handleInputChange.bind(this)}
        />

      </div>
      <div className="dropDownOutercontainer">
      <div className="dropDownContainer">
      <div className="dropDown">
        {this.state.heroes && this.state.heroes.map((hero, i) => (
          <Link key={i} to={`heroes/${heroSearchList2[hero]}`}>
          <span className="dropDownContentHero">{hero}</span>
          </Link>
        ))}
        {this.state.players && this.state.players.map((player, i) => (
          <Link key={i} to={`players/${playerSearchList[player]}`}>
          <div className="dropDownContentPlayer">{player}</div>
          </Link>
        ))}
        </div>
        </div>
        </div>
      </div>
    );
  }
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
        <Switch>
          <Route exact path="/">
            <Search players={this.state.players} />
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