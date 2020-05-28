import React from 'react';

const Footer = () => {
  return (
    <div className="footerOuterContainer">
      <div className="footerInnerContainer">
        <span className="questions">Questions/Suggestions?</span>
        <a href="https://discord.gg/nXdZWMT"> <img className="discordLogo" src="https://discordapp.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg"/>
        </a>
      </div>
      <span className="inspired">Inspired by Dota2ProTracker :)</span>
    </div>
  );
};

export default Footer;
