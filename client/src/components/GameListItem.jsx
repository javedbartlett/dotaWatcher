import React from 'react';
import heroesList from '../heroList.js';
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";

const colors = [
  'Blue',
  'Teal',
  'Purple',
  'Yellow',
  'Orange',
  'Pink',
  'Grey',
  'Light Blue',
  'Dark Green',
  'Brown',
];

const GameListItem = props => (
  <div className="feed">
    <ul>
      <li className="feed-list-item">
        Players:
        <ul className="players"> {props.data.players.map((data, i) =>(
          <li className="playerName" key={i}>
            {i == 5 ?
            <div className="vs">VS</div>
            : ""}
            {props.players[data.account_id] ?
            <span className="proPlayer"> {props.players[data.account_id]} </span>
            :
            colors[i]},
            <span> </span>
            {heroesList[data.hero_id] ? heroesList[data.hero_id] : "Picking Hero"}</li>
        ))}
          </ul>
        <div className="steamId"
        // onClick={props.blogClickHandler}
        >
          <div className="console">
        Console: <span className="data"> watch_server {props.data.server_steam_id}</span>
        </div>
        <div className="mmr">
          MMR Average: <span className="data">{props.data.average_mmr}</span>
        </div>
        <div className="rad-score">
          Radiant: <span className="data">{props.data.radiant_score} Kills </span>
        </div>
        <div className="dire-score">
          Dire: <span className="data">{props.data.dire_score} Kills </span>
        </div>
        <div className="spectators">
          Spectators: <span className="data">{props.data.spectators}</span>
        </div>
        <div className="time">
          Time: <span className="data">{moment.duration(props.data.game_time, "seconds").format("mm:ss")
          }</span>
        </div>
        <div>-----------------------------------------------------------------------------</div>
          </div>
      </li>
    </ul>
  </div>
);

export default GameListItem;