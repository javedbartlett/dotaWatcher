import React from 'react';
import GameListItem from './GameListItem.jsx'

const GameList = props => (
  <div className="container">
  <div className="GameList">
    {props.data.map((data, i) => (
      <GameListItem
      // handleClick={props.handleClick}
      key={i}
      data={data}
      players={props.players}
      />
    ))}
  </div>
  </div>
);

export default GameList;
