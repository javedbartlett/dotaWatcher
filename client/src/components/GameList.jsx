import React from 'react';
import GameListItem from './GameListItem.jsx';
import { Spring } from 'react-spring/renderprops';

const GameList = props => (
  <Spring
  from={{opacity: 0}}
  to={{opacity: 1}}
  >
    {props1 => (
      <div style={props1}>


  <div className="outerContainer">
    <div className="innerContainer">
      <div className="liveGamesWithPros">LIVE GAMES WITH PROS</div>
      <div className="container">
        <div className="GameList">
          { props.data.length ? props.data.map((data, i) => {
          return (
            <GameListItem
              key={i}
              data={data}
              players={props.players}
            />
          )}) :
          <div>
          <h1 style={{padding:'25px'}}>Looks Like Steam API is down :(</h1>
          <h1>Waiting for Gabe to restart the server</h1>
          <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x" />
          </div>
          }
        </div>
      </div>
    </div>
  </div>
  </div>
    )}
  </Spring>
);

export default GameList;
