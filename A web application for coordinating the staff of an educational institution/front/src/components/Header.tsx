import React from 'react';
import Logo from './Logo'

const Header: React.FC = () => {
  return (
    <header>
      <div className="container top">
        <Logo />
        <div className="stack">л26</div>
      </div>
    </header>
  );
};

export default Header;
