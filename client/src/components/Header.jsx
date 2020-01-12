import React from 'react';

function Header(props) {
  return (
    <div className="headerContainer">
  <h1 className="title">Dota Player Tracker</h1>
  <h5 className="notice">*Games auto-update (no need to refresh page)</h5>
  <div className="liveGamesTitleContainer">
  </div>
  </div>
  )
}

export default Header;