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
          {props.data.map((data, i) => (
            <GameListItem
              key={i}
              data={data}
              players={props.players}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
  </div>
    )}
  </Spring>
);

export default GameList;
