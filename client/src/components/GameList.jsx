import React from 'react';
import GameListItem from './GameListItem.jsx'

const GameList = props => (
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
);

export default GameList;
