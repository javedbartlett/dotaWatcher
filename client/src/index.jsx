import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import Header from './components/Header';
import { heroesList, localizedList, newHeroes, heroSearchList, heroSearchList2 } from './heroList.js';
import './styles.css';
import axios from 'axios';
import { Spring } from 'react-spring/renderprops';
import { timeSince2 } from './timeSince.js';
import cheerio from 'cheerio';
import _ from 'lodash';
import '@babel/polyfill';
import ReactGA from 'react-ga';
import { createBrowserHistory as createHistory } from "history";
import Footer from './components/Footer.jsx';
import {
  Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

ReactGA.initialize('UA-156051540-1')

const history = createHistory()
history.listen(location => {
	ReactGA.set({ page: location.pathname })
	ReactGA.pageview(location.pathname)
})

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
  }, [id]);

    return (
        <div className="historyContainer">
          <Spring
            from={{opacity: 0,  marginLeft: -500}}
            to={{opacity: 1,  marginLeft: 0}}
            config={{ delay: 1000, duration: 500 }}
          >
             {props1 => (
            <div style={props1}>
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{props.players[id]}</h1>
          </div>
          </div>
             )}
          </Spring>
          <Spring
            from={{opacity: 0,  marginRight: -500}}
            to={{opacity: 1,  marginRight: 0}}
            config={{ delay: 1000, duration: 500 }}
            >
            {props1 => (
            <div style={props1}>
          <div className="playerImageContainer">
            {/* <img src={`${player.image}`}/> */}
            {player.image ?
            <img src={`data:image/jpeg;base64,${player.image && player.image}
            `}/>
            : ""}
          </div>
          </div>
          )}
          </Spring>

          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 1000, duration: 500 }}
            >
            {props1 => (
            <div style={props1}>
          <div className="siteLink" >
            <a href={`https://www.dotabuff.com/players/${id}`}>Dotabuff</a><span> • </span>
            <a href={`https://www.opendota.com/players/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/player/${id}`}>STRATZ </a>
            </div>
            </div>
            )}
            </Spring>
          <div className="historyGamesContainer">
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 1000, duration: 500 }}
            >
            {props1 => (
            <div style={props1}>
            <div className="matchHistoryTitle">Match History</div>
            </div>
            )}
            </Spring>
            <div className="minimapOuterContainer">
            <div className="minimapContainer">
          {player.data && player.data.map((game, i) => {
          const heroIdOfPlayer = game.players.find(p => p.account_id === +id).hero_id;
          const teamOfPro = game.players.find(p => p.hero_id === +heroIdOfPlayer).team;
          const otherTeam = teamOfPro === 2 ? 3 : 2;
          const playedWith = game.players.filter(p => p.team === teamOfPro && props.players[p.account_id] && p.hero_id !== +heroIdOfPlayer).map(p => props.players[p.account_id]);
          const playedAgainst = game.players.filter(p => p.team === otherTeam && props.players[p.account_id] && p.hero_id !== +heroIdOfPlayer).map(p => props.players[p.account_id]);

          let winOrLose = ""
          if (teamOfPro === 2) {
            if (game.radiant_win === true) {
              winOrLose = "won"
            } else if (game.radiant_win === false) {
              winOrLose = "lost"
            } else winOrLose = "TBD"
          }
          if (teamOfPro === 3) {
            if (game.radiant_win === true) {
              winOrLose = "lost"
            } else if (game.radiant_win === false) {
              winOrLose = "won"
            } else if (game.radiant_win === undefined) {
              winOrLose = "TBD"
            }
          }
          return (<div className="historyId" key={i}>
              <div className="minimapIconDiv"><Link to={"/heroes/" + heroIdOfPlayer }> <img className={
            winOrLose === "won" ? "minimapIconWin" :
            winOrLose === "lost" ? "minimapIconLose" : "minimapIcon"}
              src={ (game.players.find(player => player.account_id === +id).hero_id == 128 || game.players.find(player => player.account_id === +id).hero_id == 126) ?
              newHeroes[game.players.find(player => player.account_id === +id).hero_id] : `http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[game.players.find(player => player.account_id === +id).hero_id].replace('npc_dota_hero_', '')}_icon.png`}/> </Link> </div>

            {" "}<div className="historyStats">
            <div className="nameAndAgainst">{props.players[game.players.find(p => p.hero_id === +heroIdOfPlayer).account_id]}
              {winOrLose === "won" ? <span className="won"> {winOrLose}</span> : <span className="lost"> {winOrLose}</span> }
            {playedWith.join(',') ? <span className="with"> with </span>:"" }

            <span className="playedWith">{playedWith ?
            playedWith.map((player, i) => <a key={i} href={"/players/" + props.invertedPlayers[player]}><span> {i < (playedWith.length - 1 )  ? `${player}, ` : player} </span></a>)
            : ""}</span>

            {playedAgainst.join(',') ? <span className="against"> against </span>:"" }
            <span className="playedAgainst">{playedAgainst ?
            playedAgainst.map((player, i) => <a key={i} href={"/players/" + props.invertedPlayers[player]}><span> {i < (playedAgainst.length - 1 )  ? `${player}, ` : player} </span></a>)
            : ""}</span>

            </div>
            <div className="historyDetails">{" "}
            <span className="playerDetailLink"><a href={`https://www.dotabuff.com/matches/${game.match_id}`}>Dotabuff</a></span>
            {" "}•{" "}
          <span className="playerDetailLink"><a href={`https://www.opendota.com/matches/${game.match_id}`}>OpenDota</a></span>
          {" "}•{" "}
          <span className="playerDetailLink"><a href={`https://stratz.com/en-us/matches/${game.match_id}`}>Stratz</a></span>
            {" "}•{" "}{timeSince2(game.createdAt)}{" "}•{" "}{game.average_mmr} avg MMR</div>
              </div></div>
              )})}
          </div>
          </div>
          </div>
        </div>
    );
}

const Heroes = (props) => {
  let { id } = useParams();

  const [games, setGames] = useState([]);
  // const [proOfHero, setProOfHero] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await axios(`/api/heroes/${id}`);
      await setGames(response);
      games.sort((a, b) =>
      a.updatedAt > b.updatedAt ? -1 : 1,
    );
    }
    fetchData();
  }, [id]);

    return (
        <div className="historyContainer">
            <Spring
            from={{opacity: 0,  marginLeft: -500}}
            to={{opacity: 1,  marginLeft: 0}}
            config={{ delay: 1000, duration: 500 }}
          >
             {props1 => (
            <div style={props1}>
          <div className="historyHeaderContainer">
          <h1 className="historyHeader">{heroesList[id]}</h1>
          </div>
          </div>
             )}
          </Spring>
          <Spring
            from={{opacity: 0,  marginRight: -500}}
            to={{opacity: 1,  marginRight: 0}}
            config={{ delay: 1000, duration: 500 }}
            >
            {props1 => (
            <div style={props1}>
          <div className="heroImageContainer">
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[id].replace('npc_dota_hero_', '')}_full.png`}/>
          </div>
          </div>
            )}
            </Spring>
            <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 1000, duration: 500 }}
            >
            {props1 => (
            <div style={props1}>
          <div className="siteLink" >
            <a href={`https://www.opendota.com/heroes/${id}`}>OpenDota</a> <span> • </span>
            <a href={`https://stratz.com/en-us/heroes/${id}`}>STRATZ </a>
            </div>
            </div>
            )}
            </Spring>
          <div className="historyGamesContainer">
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 1000, duration: 500 }}
            >
            {props1 => (
            <div style={props1}>
            <div className="matchHistoryTitle">Match History</div>
            <div className="introMessage"> {heroesList[id]} has been picked by pros {games.data && games.data.length} times in the last 2 weeks</div>
            </div>
            )}
            </Spring>
            <div className="minimapOuterContainer">
            <div className="minimapContainer">
          {games.data && games.data.map((game, i) => {
            const teamOfPro = game.players.find(p => p.hero_id === +id).team;
            const otherTeam = teamOfPro === 2 ? 3 : 2;
            const playedWith = game.players.filter(p => p.team === teamOfPro && props.players[p.account_id] && p.hero_id !== +id).map(p => props.players[p.account_id]);
            const playedAgainst = game.players.filter(p => p.team === otherTeam && props.players[p.account_id] && p.hero_id !== +id).map(p => props.players[p.account_id]);
            let winOrLose = ""
            if (teamOfPro === 2) {
              if (game.radiant_win === true) {
                winOrLose = "won"
              } else if (game.radiant_win === false) {
                winOrLose = "lost"
              } else winOrLose = "TBD"
            }
            if (teamOfPro === 3) {
              if (game.radiant_win === true) {
                winOrLose = "lost"
              } else if (game.radiant_win === false) {
                winOrLose = "won"
              } else if (game.radiant_win === undefined) {
                winOrLose = "TBD"
              }
            }
            const playerId = game.players.find(p => p.hero_id === +id).account_id
            // console.log(typeof teamOfPro)
            return (
          <div className="historyId" key={i}>
            {/* {setProOfHero(game.players.find(p => p.hero_id === +id).team)}
             */}
          <div className="minimapIconDiv"> <img className={
            winOrLose === "won" ? "minimapIconWin" :
            winOrLose === "lost" ? "minimapIconLose" : "minimapIcon"}
          src={ (id == 128 || id == 126) ? newHeroes[id] : `http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[id].replace('npc_dota_hero_', '')}_icon.png`}/>{"  "}
          <div className="historyStats">
          <div className="nameAndAgainst"><Link to={"/players/" + playerId}> {props.players[playerId]} </Link>

          {winOrLose === "won" ? <span className="won"> {winOrLose}</span> : <span className="lost"> {winOrLose}</span> }

          {playedWith.join(',') ? <span className="with"> with </span> :"" }
          <span className="playedWith">{playedWith ?
            playedWith.map((player, i) => <Link key={Math.random()} to={"/players/" + props.invertedPlayers[player]}><span> {i < (playedAgainst.length - 1 )  ? `${player}, ` : player} </span></Link>)
            : ""}</span>

          {playedAgainst.join(',') ? <span className="against"> against </span> :"" }<span className="playedAgainst">{playedAgainst ?
            playedAgainst.map((player, i) => <Link key={Math.random()} to={"/players/" + props.invertedPlayers[player]}><span> {i < (playedAgainst.length - 1 )  ? `${player}, ` : player} </span></Link>)
            : ""}</span></div>

          <div className="historyDetails">{" "}
          <span className="playerDetailLink"><a href={`https://www.dotabuff.com/matches/${game.match_id}`}>Dotabuff</a></span>
          {" "}•{" "}
          <span className="playerDetailLink"><a href={`https://www.opendota.com/matches/${game.match_id}`}>OpenDota</a></span>
          {" "}•{" "}
          <span className="playerDetailLink"><a href={`https://stratz.com/en-us/matches/${game.match_id}`}>Stratz</a></span>

          {" "}•{" "}{timeSince2(game.createdAt)}{" "}•{" "}{game.average_mmr} avg MMR</div>
          </div> </div></div>

          )})}


          {/* { " played with ".concat(game.players.filter(p => p.team === 2 && props.players[p.account_id] && p.hero_id !== +id)) } */}
          </div>
          </div>
          </div>

        </div>
    );
}

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
      <Spring
    from={{opacity: 0, marginLeft: -100 }}
    to={{opacity: 1, marginLeft: 0 }}
    config={{ delay: 200, duration: 500 }}
    >
    {props1 => (
    <div style={props1}>
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
        {this.state.heroes.length ? <div className="dropDownTitle">Heroes
        {this.state.heroes.map((hero, i) => (
          <Link key={i} to={`heroes/${heroSearchList2[hero]}`}>
          <div className="dropDownContentHero">{hero}</div>
          </Link>
        ))}</div> : null}

        {this.state.players.length ? <div className="dropDownTitle">Players
        {this.state.players.map((player, i) => (
          <Link key={i} to={`players/${playerSearchList[player]}`}>
          <div className="dropDownContentPlayer">{player}</div>
          </Link>
        ))}</div> : null}
        </div>
        </div>
        </div>
      </div>
      </div>
          )}
          </Spring>
    );
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      players: {},
      isOpen: false,
    };
    this.handleClickAway = this.handleClickAway.bind(this)
  }

  handleClickAway(e) {
    console.log(e.target)
  }

  clickHandler(){
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname)
    this.loadGames();
    this.loadPlayers();
    this.interval = setInterval(() => {
      this.loadGames();
    }, 2000);

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
      <Router history={history}>
        <Header />
        <Switch>
          <Route exact path="/">
            <Search players={this.state.players} />
            <GameList players={this.state.players} data={this.state.games} />
            <Footer />
          </Route>
          <Route exact path="/players/:id">
            <Player players={this.state.players} invertedPlayers = {_.invert(this.state.players)} />
          </Route>
          <Route exact path="/heroes/:id">
            <Heroes players={this.state.players} invertedPlayers = {_.invert(this.state.players)} />
          </Route>
        </Switch>
        </Router>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('app'));
