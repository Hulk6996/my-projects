import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import './Schedule.css';
import { FaTrash } from 'react-icons/fa';

interface User {
  name: string;
  role: string;
}

const Schedule = () => {
  const [user, setUser] = useState<User | null>(null);
  const [scheduleFiles, setScheduleFiles] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndSchedule = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const profileRes = await axios.get('http://localhost:3001/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
  
          if (profileRes.data.success) {
            setUser(profileRes.data.data);
          } else {
            setError('Ошибка при загрузке данных пользователя');
          }
  
          const scheduleRes = await axios.get('http://localhost:3001/api/schedule/download', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
  
          if (scheduleRes && scheduleRes.data) {
            setScheduleFiles(scheduleRes.data);
          } else {
            console.log('Расписание еще не загружено');
          }
        } catch (error) {
          setError('Расписание еще не загружено');
        }
      }
    };
  
    fetchProfileAndSchedule();
  }, []);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Нет токена авторизации');
        }
        const response = await axios.post('http://localhost:3001/api/schedule/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Файл успешно загружен:', response.data);
        window.location.reload(); 
      } catch (error) {
        setError('Ошибка при загрузке файла');
      }
    }
  };
  

  const handleDeleteSchedule = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Нет токена авторизации');
      }
      await axios.delete('http://localhost:3001/api/schedule', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      setError('Ошибка при удалении файла');
    }
  };

  const handleFileClick = (filePath: string) => {
    window.open(filePath);
  };

  return (
    <>
      <Header />
      <div className="cont">
        {error && <p>{error}</p>}
        {user && (
          <div>
             {user.role === 'manager' && (
              <div className="head">
                <div className="upload-section">
                  <input type="file" onChange={handleFileUpload} className="upload-input" />
                  <button onClick={handleDeleteSchedule} className="del-button">
                    <FaTrash className="del-icon"/> 
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {scheduleFiles.length > 0 && (
          <div className="schedule-section">
            <h1>Расписание</h1>
            {scheduleFiles.map((filePath: string, index: number) => (
              <div key={index} className="file-item">
                <button onClick={() => handleFileClick(filePath)} className="file-button">Открыть расписание {index + 1}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Schedule;