import React, { useCallback, useState } from 'react';
import minimap from '../img/Minimap_7.23.jpg';
// import minimap from '../img/Minimap_7.23_crop.jpg';
import rTower from '../img/redTower.jpg';
import gTower from '../img/greenTower.jpg';
import { localizedList, newHeroes } from '../heroList';
import { Rnd } from 'react-rnd';


const CustomHandle = props => (
  <div
    style={{
      // background: "black",
      borderRadius: "2px",
      // border: "1px solid #ddd",
      height: "20px",
      width: "20px",
      padding: 0,
      color: "rgba(245, 245, 245, 0.536)",
      fontSize: "30px",
      marginLeft: "-12px",
      marginTop: "-24px",
      zIndex: 2000,
      position: "absolute",
    }}
  >⇲</div>
);

const Minimap = (props) => {
  const { players } = props.data.data;
  const { buildings } = props.data.data;
  const { rightClickHandler } = props;
  const [dimensions, setDimensions] = useState({ height: "550px", width: "560px" })

  const mapStyle = {
    backgroundImage: `url(${minimap})`,
    backgroundSize: "cover",
    height: dimensions.height,
    width: dimensions.width,
  }

  const resizeCorner = {
    width: "100px",
    height: "100px"
  }

  const onResizeStop = (e, direction, ref, delta, position) => {
    setDimensions({
      width: ref.style.width,
      height: ref.style.height,
    });
  }

  return (
    <Rnd
    size={{ width: dimensions.width, height: dimensions.height }}
    minWidth={560}
    minHeight={550}
    onResize={onResizeStop}
    onResizeStop={onResizeStop}
    lockAspectRatio={true}
    resizeHandleComponent={{ bottomRight: <CustomHandle /> }}
    >

      <div onContextMenu={rightClickHandler} style={mapStyle} className="realMinimapContainer">
      {players.map((player, i) => {
        const heroName = localizedList[player.hero_id].replace('npc_dota_hero_', '');
        const x = (player.x*100) + 47;
        const y = (player.y*100) + 48;
        return (
          <img draggable="false" key={i}
          style={{left: x + '%', bottom: y + '%' }}
          className="mapIcon" src={
            player.hero_id ?
            player.hero_id === 126 || player.hero_id === 128 ?
            newHeroes[player.hero_id] :
            `http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_icon.png`
            : `https://gamepedia.cursecdn.com/dota2_gamepedia/6/65/Thyg_the_Giftsnatch_Greevil_minimap_icon.png?version=086a0caa461835865d54be6d50396dc7`
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
      <div className="closeButton"style={{height: '30px', width: 'auto', draggable: false}}
      onClick={rightClickHandler}
      >✖</div>
      </div>
      </Rnd>
  )
}

export default Minimap;
