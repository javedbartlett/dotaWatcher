import React from 'react';
import { Link } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';

function Header(props) {
  return (
    <Spring
    from={{opacity: 0, marginLeft: -500 }}
    to={{opacity: 1, marginLeft: 0 }}
    config={{ delay: 200, duration: 500 }}
    >
    {props1 => (
    <div style={props1}>
    <div className="headerContainer">
  <h1 className="title"><Link to="/">Dota Player Tracker</Link></h1>
  <h5 className="notice">*Games auto-update</h5>
  </div>
  </div>
    )}
  </Spring>
  )
}

export default Header;