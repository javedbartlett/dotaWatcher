import React from 'react';
import { heroesList, localizedList } from '../heroList.js';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

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
// `http://cdn.dota2.com/apps/dota2/images/heroes/${heroesList[data.hero_id].split(' ').join('_').toLowerCase()}_full.png`
// {heroesList[data.hero_id].split(' ').join('_').toLowerCase()}

// localizedList[data.hero_id].replace("npc_dota_hero_", "")
const GameListItem = props => (
  <div className="feedContainer">
  <div className="feed">
    {/* {console.log(props.data.game_time)} */}
    {props.data.players.map((data, i) => (
      <div key={i} className="liveMatch">
        <div className="liveMatchInfo"></div>
        <div name={i < 5 ? 'radiant' : 'dire'} className={`grid${i+1}`}>
          <div className={i < 5 ? 'radiantPortrait' : 'direPortrait'} >
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[data.hero_id].replace("npc_dota_hero_", "")}_full.png`}></img>
            </div>
          <div className="liveMatchPlayerName">
          {props.players[data.account_id] ?
          (<div className="proPlayer"> {props.players[data.account_id]}</div>)
          : (data.name.substring(0, 5))} <div>{heroesList[data.hero_id]} </div>
            </div>
          <div className="liveMatchPlayerScore">score</div>
          <div className="liveMatchPlayerLevel">{data.level}</div>

        </div>
      </div>
    ))}
          <div>{props.data.server_steam_id.toString()}</div>
  </div>
  </div>
);

export default GameListItem;


{/* <ul>
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
                data.name.substring(0, 5)
              )}
              ,<span> </span>
              {heroesList[data.hero_id]
                ? heroesList[data.hero_id]
                : 'Picking Hero'}{' '}
              <ul>
                <li>
                  Level {data.level}{' '}
                  <div>
                    {data.net_worth > 1000
                      ? (data.net_worth / 1000).toFixed(1) + 'K'
                      : data.net_worth + 'g'}{' '}
                    - {data.kill_count}/{data.death_count}/{data.assists_count}
                  </div>
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
    </ul> */}