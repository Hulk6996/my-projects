import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './AdminClientsPage.css';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
}

const AdminClientsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/clients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    if (password.length < 6 || !/\d/.test(password)) {
      setError('Пароль должен содержать как минимум 6 символов и 1 цифру');
      return false;
    }
    setError('');
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword(password, confirmPassword)) {
      return;
    }
    try {
      await axios.patch(`http://localhost:3001/api/users/change-password/${selectedUserId}`, { newPassword: password }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setShowModal(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="admin-client-page">
      <SidebarMenu role="admin" onLogout={handleLogout} />
      <div className="header">
        <h1>Admin - Клиенты</h1>
      </div>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Имя:</strong> {user.name} {user.surname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Телефон:</strong> {user.phone}</p>
            <div className="actions">
              <FaEdit className="icon" onClick={() => { setSelectedUserId(user.id); setShowModal(true); }} />
              <FaTrash className="icon" onClick={() => handleDeleteUser(user.id)} />
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className='profile-form'>
            <h2>Изменить пароль</h2>
            <input
              type="password"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button onClick={handleChangePassword}>Изменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;
