import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Header from '../Header/Header';
import PostCreator from './PostCreator';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  profilePicture: string;
  role: string;
}

interface ProfileProps {
  handleLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ handleLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stackCode, setStackCode] = useState<string | null>(null);
  const [stackCodeId, setStackCodeId] = useState<number | null>(null);
  const [stackCodeIsActive, setStackCodeIsActive] = useState<boolean | null>(null);

  const defaultProfileImages = [
    'https://gimn28-maxachkala-r82.gosweb.gosuslugi.ru/netcat_files/8/140/129_1291012_teachers_downy_2.png',
    'https://e7.pngegg.com/pngimages/888/481/png-clipart-teacher-professor-education-school-computer-icons-teacher-angle-hat.png',
    'https://img2.freepng.ru/20190625/ff/kisspng-teacher-tutor-education-student-school-download-k-12-teachers-would-be-the-primary-users-5d12e65db7c538.9565089515615197097527.jpg',
    'https://cdn4.iconfinder.com/data/icons/school-and-education-3-5/128/132-1024.png',
    'https://kartinki.pibig.info/uploads/posts/2023-04/1682166497_kartinki-pibig-info-p-kartinka-pedagog-arti-pinterest-53.png'
  ];

useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:3001/api/users/profile', {
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

  fetchData();
}, []);

const handleEditToggle = () => {
  setEditMode(!editMode);
};

const selectProfileImage = (imageUrl: string) => {
  if (editableUser) {
    setEditableUser({ ...editableUser, profilePicture: imageUrl });
  }
};

const handleSave = async () => {
  if (!editableUser) {
    setError('Пользователь не определен');
    return;
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    setError('Токен аутентификации не найден');
    return;
  }

  try {
    const response = await axios.patch('http://localhost:3001/api/users/update', {
      ...user,
      ...editableUser,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      setUser(response.data.updatedUser);
      setEditMode(false);
    } else {
      setError('Ошибка при сохранении профиля');
    }
  } catch (error) {
    setError('Ошибка при сохранении профиля');
  }
};

const handleGenerateStackCode = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    setError('Токен аутентификации не найден');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3001/api/stackcode/generate/2', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      setStackCode(response.data.code);
      setStackCodeId(response.data.id);
      setStackCodeIsActive(response.data.isActive);
    } else {
      setError('Ошибка при генерации Stack Code');
    }
  } catch (error) {
    setError('Ошибка при генерации Stack Code');
  }
};

return (
  <>
    <Header />
    <div className="profile">
        {editMode ? (
          <>
            <input
              type="text"
              className="profile-edit-input"
              value={editableUser?.name || ''}
              onChange={(e) => setEditableUser({ ...editableUser!, name: e.target.value })}
            />

            <input
              type="text"
              className="profile-edit-input"
              value={editableUser?.surname || ''}
              onChange={(e) => setEditableUser({ ...editableUser!, surname: e.target.value })}
            />

            <input
              type="text"
              className="profile-edit-input"
              value={editableUser?.email || ''}
              onChange={(e) => setEditableUser({ ...editableUser!, email: e.target.value })}
            />
            <div className="profile-images">
              {defaultProfileImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Profile ${index + 1}`}
                  className={`profile-image ${editableUser?.profilePicture === imageUrl ? 'selected' : ''}`}
                  onClick={() => selectProfileImage(imageUrl)}
                />
              ))}
            </div>
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <div onClick={handleLogout} className="cl-btn-6"></div>
            <h1>{user?.name} {user?.surname}</h1>
            <p>{user?.email}</p>
            <img src={user?.profilePicture || 'path_to_anonymous_image.png'} alt="Profile" />
            <button onClick={handleEditToggle} className="edit-button">Edit</button>
          </>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
      <PostCreator />
      {user?.role === 'manager' && (
        <>
          <button onClick={handleGenerateStackCode} className="generate-stack-code-button">
            Generate Stack Code
          </button>
          {stackCodeIsActive && stackCode && (
            <div className="centered stack-code">
              <p>Stack Code: <code>{stackCode}</code></p>
            </div>
              )}
        </>
      )}
    </>
  );
};

export default Profile;