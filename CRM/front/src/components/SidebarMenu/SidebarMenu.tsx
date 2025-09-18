import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import './SidebarMenu.css';
import logo from '../../img/log.png';

type UserRole = 'employee' | 'manager' | 'client' | 'admin';

interface SidebarMenuProps {
  role: UserRole;
  onLogout: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ role, onLogout }) => {
  const getMenuItems = () => {
    switch (role) {
      case 'employee':
        return [
          { name: 'Профиль', path: '/profile' },
          { name: 'Задачи', path: '/task_board' },
        ];
      case 'manager':
        return [
          { name: 'Профиль', path: '/profile' },
          { name: 'Задачи', path: '/task_board' },
          { name: 'Клиенты', path: '/clients' },
          { name: 'Код', path: '/code' },
        ];
      case 'client':
        return [
          { name: 'Профиль', path: '/profile' },
          { name: 'Задачи', path: '/task_board' },
          { name: 'Создание задачи', path: '/task_form' },
        ];
      case 'admin':
        return [
          { name: 'Логи', path: '/admin' },
          { name: 'Руководители', path: '/admin_manager' },
          { name: 'Сотрудники', path: '/admin_employee' },
          { name: 'Клиенты', path: '/admin_clients' },
          { name: 'Код', path: '/admin_code' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div onClick={onLogout}>
          <FaSignOutAlt className="logout-icon" />
        </div>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.name}>
            <a href={item.path}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
