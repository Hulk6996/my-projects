import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaEdit } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import './ProfilePage.css';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface Task {
  id: number;
  title: string;
  price: number;
  status: string;
  creationDate: string;
  user: {
    id: number;
  };
}

type UserRole = 'employee' | 'manager' | 'client';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded: { role: UserRole } = jwtDecode(token);
          setRole(decoded.role);
          const response = await axios.get(`http://localhost:3001/api/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setUser(response.data.data);
            setEditableUser(response.data.data);
          } else {
            setError('Ошибка при загрузке данных пользователя');
          }
        } catch (error) {
          setError('Ошибка при загрузке данных пользователя');
        }
      }
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`http://localhost:3001/api/tasks`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.status === 200 && user) {
            const userTasks: Task[] = response.data.filter((task: Task) => task.user.id === user.id);
            setTasks(userTasks);
          }
        } catch (error) {
          setError('Ошибка при загрузке задач пользователя');
        }
      }
    };

    fetchUserData();
    fetchTasks();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editableUser) {
      setEditableUser({
        ...editableUser,
        [name]: value
      });
    }
  };

  const handleSave = async () => {
    if (editableUser) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(`http://localhost:3001/api/users/update`, editableUser, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setUser(editableUser);
          setError(null);
          setIsEditing(false);
        } else {
          setError('Ошибка при сохранении данных');
        }
      } catch (error) {
        setError('Ошибка при сохранении данных');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'employee':
        return 'Сотрудник';
      case 'manager':
        return 'Руководитель';
      case 'client':
        return 'Клиент';
      default:
        return '';
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-page-container">
      {role && <SidebarMenu role={role} onLogout={handleLogout} />}
      <div className="profile-page">
        {error && <p className="error">{error}</p>}
        <div className="user-profile">
          <div className="edit-icon" onClick={handleEdit}><FaEdit /></div>
          <div className="username">{user.name} {user.surname}</div>
          <div className="bio">{getRoleLabel(user.role)}</div>
          <ul className="data">
            <li>Email: {user.email}</li>
            <li>Телефон: {user.phone}</li>
          </ul>
        </div>
        {isEditing && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={handleClose}><AiOutlineClose /></span>
              <h2>Редактировать профиль</h2>
              <div className="profile-form">
                <label>
                  Имя:
                  <input
                    type="text"
                    name="name"
                    className='input'
                    value={editableUser?.name || ''}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Фамилия:
                  <input
                    type="text"
                    name="surname"
                    className='input'
                    value={editableUser?.surname || ''}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    className='input'
                    value={editableUser?.email || ''}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Телефон:
                  <input
                    type="tel"
                    name="phone"
                    className='input'
                    value={editableUser?.phone || ''}
                    onChange={handleChange}
                  />
                </label>
                <button onClick={handleSave}>Сохранить</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {role === 'client' && (
        <div className="tasks-container">
          <h2>Ваши задачи</h2>
          {tasks.length > 0 ? (
            <ul className="tasks-list">
              {tasks.map(task => (
                <li key={task.id} className="task-item">
                  <p>Наименование: {task.title}</p>
                  <p>Сумма: {task.price} ₽</p>
                  <p>Статус: {task.status}</p>
                  <p>Дата создания: {new Date(task.creationDate).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>У вас нет задач</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

