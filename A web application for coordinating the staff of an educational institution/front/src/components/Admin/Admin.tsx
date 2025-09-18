import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { FaCog, FaTrash } from 'react-icons/fa';

interface User {
  id: number;
  profilePicture: string;
  name: string;
  surname: string;
  email: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stackCode1, setStackCode1] = useState({ code: null, id: null, isActive: null });
  const [stackCode2, setStackCode2] = useState({ code: null, id: null, isActive: null });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3001/api/users/non-admins', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        setError('Не удалось загрузить список пользователей');
      }
    };

    fetchUsers();
  }, []);

  const handleGenerateStackCode = async (tableNumber: number) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/stackcode/generate/${tableNumber}`);
      const { code, id, isActive } = response.data;

      if (tableNumber === 1) {
        setStackCode1({ code, id, isActive });
      } else {
        setStackCode2({ code, id, isActive });
      }
      setError('');
    } catch (error) {
      setError('Ошибка при генерации Stack Code');
    }
  };


  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
      setError('');
    } catch (error) {
      setError('Ошибка при удалении пользователя');
    }
  };

  const openChangePasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>, userId?: number) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newPassword = form.elements.namedItem('newPassword') as HTMLInputElement;
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:3001/api/users/change-password/${userId}`, {
        newPassword: newPassword.value
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsPasswordModalOpen(false);
      setError('');
      alert('Пароль успешно изменен');
    } catch (error) {
      setError('Ошибка при смене пароля');
    }
  };
  

  return (
    <div className="admin-page">
      <div onClick={handleLogout} className="cl-btn-7"></div>
      <div className="stack-code-container">
        <div className="stack-code-block">
          <button onClick={() => handleGenerateStackCode(1)}>Руководитель</button>
          {stackCode1.isActive && <p>Stack Code: <code>{stackCode1.code}</code></p>}
        </div>
        <div className="stack-code-block">
          <button onClick={() => handleGenerateStackCode(2)}>Сотрудник</button>
          {stackCode2.isActive && <p>Stack Code: <code>{stackCode2.code}</code></p>}
        </div>
      </div>

      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user">
            <img src={user.profilePicture} alt={`${user.name} ${user.surname}`} />
            <div className="user-info">
              <p>{user.name} {user.surname}</p>
              <p>{user.email}</p>
            </div>
            <div className="user-actions">
              <FaCog className="settings-icon" onClick={() => openChangePasswordModal(user)} />
              <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPasswordModalOpen && (
        <div className="password-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsPasswordModalOpen(false)}>&times;</span>
            <h2>Смена пароля для<br></br> {selectedUser?.name} {selectedUser?.surname}</h2>
            <form onSubmit={(e) => handleChangePassword(e, selectedUser?.id)}>
            <input type="password" name="newPassword" placeholder="Новый пароль" />
              <button type="submit" className='change-password-button'>Сменить пароль</button>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdminPage;
