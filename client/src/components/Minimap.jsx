import React, { useCallback, useState } from 'react';
// import minimap from '../img/Minimap_7.23.jpg';
import minimap from '../img/Minimap_7.23_crop.jpg';
import { localizedList, newHeroes } from '../heroList';

const mapStyle = {
  backgroundImage: `url(${minimap})`,
  backgroundSize: "contain",
  height: "550px",
  width: "580px",
}

const Minimap = (props) => {
  const { players } = props.data.data


  return (
      <div style={mapStyle} className="realMinimapContainer">
      {players.map(player => {
        const heroName = localizedList[player.hero_id].replace('npc_dota_hero_', '');
        const x = (player.x*100) + 50;
        const y = (player.y*100) + 50;
        return (
          <img
          style={{left: x + '%', top: y + '%' }}
          className="mapIcon" src={
            player.hero_id === 126 || player.hero_id === 128 ?
            newHeroes[player.hero_id] :
            `http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_icon.png`
      }></img>
        )
      })}
      </div>
  )
}

export default Minimap;
