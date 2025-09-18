import React from 'react';
import logo from '../img/log.png'

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src={logo} alt="stack" />
    </div>
  );
};

export default Logo;
