import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <div className="headerContainer">
  <h1 className="title"><Link to="/">Dota Player Tracker</Link></h1>
  <h5 className="notice">*Games auto-update (no need to refresh page)</h5>
  <div className="liveGamesTitleContainer">
  </div>
  </div>
  )
}

export default Header;