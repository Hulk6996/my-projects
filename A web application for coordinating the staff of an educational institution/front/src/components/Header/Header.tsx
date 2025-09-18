import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/profile" className="header-logo">л26</Link>
        <nav className="header-nav">
          <Link to="/news" className="header-link">Новости</Link>
          <Link to="/messenger" className="header-link">Мессенджер</Link>
          <Link to="/colleagues" className="header-link">Коллеги</Link>
          <Link to="/schedule" className="header-link">Расписание</Link>
          <Link to="/replacements" className="header-link">Замены</Link>
          <Link to="/subjects" className="header-link">Предметы</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
