import React from 'react';
import GameListItem from './GameListItem.jsx';
import { Spring } from 'react-spring/renderprops';

const GameList = props => (



  <div className="outerContainer">
    <div className="innerContainer">
      <Spring
      from={{opacity: 0,  marginTop: -500}}
      to={{opacity: 1,  marginTop: 0}}
      config={{ delay: 350, duration: 500 }}
      >
        {props1 => (
              <div style={props1}>
      <div className="liveGamesWithPros">LIVE GAMES WITH PROS</div>
      </div>
        )}
      </Spring>
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
          <Spring
          from={{opacity: 0}}
          to={{opacity: 1}}
          config={{ delay: 10000, duration: 1000 }}
          >
            {props1 => (
              <div style={props1}>
          <div>
          <h1 style={{padding:'25px'}}>Looks Like Steam API is down :(</h1>
          <h1 style={{padding:'25px'}}>Waiting for Gabe to restart the server</h1>
          <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x" />
          </div>
          </div>
              )}
              </Spring>
          }
        </div>
      </div>
    </div>
  </div>


);

export default GameList;
