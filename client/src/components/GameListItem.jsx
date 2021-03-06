import React, { useState, useEffect } from 'react';
import { heroesList, localizedList } from '../heroList';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import _ from 'lodash';
import escape from 'lodash.escape';
import { timeSince } from '../timeSince';
import { Link } from 'react-router-dom';
import Minimap from './Minimap';
import { Spring } from 'react-spring/renderprops';
import { useSpring, animated, useTransition } from 'react-spring';
import { FadeNumberWhite, FadeNumberRed } from './FadeNumber';

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

// localizedList[data.hero_id].replace("npc_dota_hero_", "")
const GameListItem = props => {
  const [isOpen, toggleOpen] = useState(false);

  const clickHandler = (e) => {
    e.preventDefault();
    toggleOpen(prevState => {
      return !prevState
    })
  }

  const copyHandler = (e) => {
    navigator.clipboard.writeText(e.target.getAttribute('value'))
  }

  const props2 = useSpring({marginTop: 0, from: {marginTop: -300}})

return (
  <Spring
  from={{opacity: 0, marginTop: -50 }}
  to={{opacity: 1, marginTop: 0 }}
  config={{ delay: Math.random() * (300 - 150) + 150, duration: Math.random() * (700 - 300) + 300 }}
  >
    {props1 => (
    <div style={props1}>

  <div className="feedContainer">
    {isOpen ?
    <Spring
    from={{opacity: 0 }}
    to={{opacity: 1 }}
    config={{ delay: 250, duration: 500 }}
    >
    {props1 => (
    <div style={props1}>

    <Minimap
    rightClickHandler={clickHandler} data={props} />
    </div>
    )}
    </Spring>
    : ""}
    <div className="feed">
      {/* {console.log(props.data.game_time)} */}
      {props.data.players.map((data, i) => {

      return (
        <div key={i} className="liveMatch" id={`grid${i + 1}`}>
          <div name={i < 5 ? 'radiant' : 'dire'}>
            <div className={i < 5 ? 'radiantPortrait' : 'direPortrait'}>
            {heroesList[data.hero_id]
                ? <Link to={{ pathname: `/heroes/${data.hero_id}`,
                state: { fromNotifications: true }
                }}>
                  <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${localizedList[data.hero_id].replace('npc_dota_hero_', '')}_vert.jpg`}/>
                  </Link>
                  : <Link to='/'><img src="http://i.imgur.com/gpnPQUK.jpg"/></Link>}
            </div>
            <div className="liveMatchPlayerName">
              {props.players[data.account_id] ? (
                <div className="proPlayer">
                  {' '}
                  <Link to={'/players/'+ data.accountid}>{props.players[data.account_id]}</Link>
                </div>
              ) : (
                <div className="normalPlayer" id={data.accountid}>{escape(data.name).substring(0, 12)} </div>
              )}
              <span className="heroName">
              {heroesList[data.hero_id]
                ? heroesList[data.hero_id].substring(0, 16)
                : 'Picking Hero'} </span>
            <div className="liveMatchPlayerScore">

              <FadeNumberWhite skip={data.kill_count === 0}
              key={'w' + data.accountid + data.kill_count} value={data.kill_count} />/
              <FadeNumberRed skip={data.death_count === 0}
              key={'r' + data.accountid + data.death_count} value={data.death_count} />/
              {data.assists_count}

            </div>
            <span className="liveMatchPlayerLevel"> Level {data.level}</span>

            <div>{data.net_worth > 1000

                      ? (data.net_worth / 1000).toFixed(1) + 'K'

                      : data.net_worth + 'g'} - CS {data.lh_count}/{data.denies_count}</div>

            </div>
          </div>
        </div>
      )})}
      <div className="time" id="grid13">
        {moment.duration(props.data.game_time, 'seconds').format('mm:ss')}
        <div className="scoreboard">{props.data.radiant_score} - {props.data.dire_score}</div>
      </div>
      <div id="grid16">
      {/* <div>watch_server</div> */}
      {/* <div id="serverId" onClick={copyHandler}
      value={props.data.server_steam_id.toString()}>Copy Server ID</div> */}
      {" "}
      <div className="minimapText"
      onClick={clickHandler}>
        View Minimap</div>
      </div>
            <div id="grid12">
            <div>{!props.data.average_mmr
              ? 'Tournament Game'
              : `Avg MMR:  ${props.data.average_mmr}`}</div>
              <div>Spectators: {props.data.spectators}</div>

              {/* {console.log(props.data.game_state)} */}
              </div>
      {/* <span id="grid11">VS</span> */}

      <span id="grid15">
        Last Update: {timeSince(props.data.updatedAt)}
        </span>
        <span id="grid17">
        <div id="serverId" onClick={copyHandler}
      value={props.data.server_steam_id.toString()}>Click to Copy Server ID</div>
        </span>
    </div>

  </div>
   </div>
        )}
         </Spring>
)}

export default GameListItem;
