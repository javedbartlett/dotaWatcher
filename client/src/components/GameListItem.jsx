import React from 'react';
import heroesList from '../heroList.js';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import _ from 'lodash'

const colors = [
  'Blue',
  'Teal',
  'Purple',
  'Yellow',
  'Orange',
  'Pink',
  'Grey',
  'Lt Blue',
  'Green',
  'Brown',
];

const GameListItem = props => (
  <div className="feed">
    {/* {console.log(props.data.game_time)} */}
    <ul>
      <li className="feed-list-item">
        <div>
          <span className="data">
            {' '}
            {!props.data.average_mmr
              ? 'Tournament Game'
              : `Avg MMR:  ${props.data.average_mmr}`}
          </span>
        </div>
        <span className="data">
          {props.data.radiant_score} - {props.data.dire_score} /{' '}
          {moment.duration(props.data.game_time, 'seconds').format('mm:ss')}
        </span>
        <ul className="players">
          {' '}
          {props.data.players.map((data, i) => (
            <li className="playerName" key={i}>
              {i == 5 ? <div className="vs">VS</div> : ''}
              {props.players[data.account_id] ? (
                <span className="proPlayer">
                  {' '}
                  {props.players[data.account_id]}
                </span>
              ) : (
                _.escape(data.name.substring(0,5))
              )}
              ,<span> </span>
              {heroesList[data.hero_id]
                ? heroesList[data.hero_id]
                : 'Picking Hero'}{' '}
              <ul>
                <li>
              Level {data.level} <div>{data.net_worth > 1000 ? (data.net_worth/1000).toFixed(1) + "K" : data.net_worth + "g"} - {data.kill_count}/{data.death_count}/{data.assists_count}</div>
                </li>
              </ul>
            </li>
          ))}
        </ul>
        <div
          className="steamId"
          // onClick={props.blogClickHandler}
        >
          <div className="console">
            <span className="data">
              watch_server {props.data.server_steam_id.toString()}
            </span>
          </div>
          <div className="spectators">
            Spectators: <span className="data">{props.data.spectators}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
);

export default GameListItem;
