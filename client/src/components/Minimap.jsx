import React, { useCallback, useState } from 'react';
import minimap from '../img/Minimap_7.23.jpg';
// import minimap from '../img/Minimap_7.23_crop.jpg';
import rTower from '../img/redTower.jpg';
import gTower from '../img/greenTower.jpg';
import { localizedList, newHeroes } from '../heroList';

const mapStyle = {
  backgroundImage: `url(${minimap})`,
  backgroundSize: "contain",
  height: "550px",
  width: "560px",
}

const Minimap = (props) => {
  const { players } = props.data.data
  const { buildings } = props.data.data

  return (
      <div style={mapStyle} className="realMinimapContainer">
      {players.map((player, i) => {
        const heroName = localizedList[player.hero_id].replace('npc_dota_hero_', '');
        const x = (player.x*100) + 47;
        const y = (player.y*100) + 48;
        return (
          <img key={i}
          style={{left: x + '%', bottom: y + '%' }}
          className="mapIcon" src={
            player.hero_id === 126 || player.hero_id === 128 ?
            newHeroes[player.hero_id] :
            `http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_icon.png`
      }></img>
        )
      })}
      {buildings.map((building, i) => {
        const x = (building.x*100) + 47;
        const y = (building.y*100) + 48;
        // const xd =
        // const xr =
        return (
          building.team > 0 ?
          <img key={i}
          style={{left: x + '%', bottom: y + '%' }}
          className="towerIcon" src={ building.team < 3 ? gTower :rTower
          }/> : ""
        )
      })}
      </div>
  )
}

export default Minimap;
