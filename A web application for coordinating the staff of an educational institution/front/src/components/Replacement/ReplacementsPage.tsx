import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './ReplacementsPage.css';

interface Replacement {
  id: number;
  selectedTeacher: { id: number; name: string; surname: string };
  replacementTeacher: { id: number; name: string; surname: string };
  lessonNumber: number;
  classNumber: string;
  date: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
  role: 'employee' | 'manager';
}

const ReplacementsPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [replacements, setReplacements] = useState<Replacement[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number>();
  const [replacementTeacher, setReplacementTeacher] = useState<number>();
  const [lessonNumber, setLessonNumber] = useState<string>('');
  const [classNumber, setClassNumber] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfileAndReplacements = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Необходима авторизация');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const profileRes = await axios.get('http://localhost:3001/api/users/profile', config);
        if (profileRes.data) {
          setCurrentUser(profileRes.data.data);

          const url = profileRes.data.data.role === 'manager' ?
            'http://localhost:3001/api/replacements' : 
            `http://localhost:3001/api/replacements/user/${profileRes.data.data.id}`;

          const replacementsRes = await axios.get(url, config);
          if (replacementsRes.data) {
            setReplacements(replacementsRes.data);
          } else {
            console.log('Замены еще не загружены');
          }
        } else {
          setError('Ошибка при загрузке данных пользователя');
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Необходима авторизация');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const teachersRes = await axios.get('http://localhost:3001/api/users/non-admins', config);
        if (teachersRes.data) {
          setTeachers(teachersRes.data);
        } else {
          setError('Ошибка при загрузке данных учителей');
        }
      } catch (err) {
        setError('Ошибка при загрузке данных учителей');
        console.error(err);
      }
    };

    fetchProfileAndReplacements();
    fetchTeachers();
  }, []);

  const handleCreate = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Необходима авторизация');
      return;
    }

    if (!selectedTeacher || !replacementTeacher) {
      setError('Выберите обоих учителей перед созданием замены');
      return;
    }

    const postData = {
      selectedTeacherId: selectedTeacher,
      replacementTeacherId: replacementTeacher,
      lessonNumber,
      classNumber,
      date
    };

    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    };

    try {
      await axios.post('http://localhost:3001/api/replacements', postData, config);
      const replacementsResponse = await axios.get('http://localhost:3001/api/replacements', config);
      setReplacements(replacementsResponse.data);
    } catch (err) {
      setError('Ошибка при создании замены');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Необходима авторизация');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      await axios.delete(`http://localhost:3001/api/replacements/${id}`, config);
      const replacementsResponse = await axios.get('http://localhost:3001/api/replacements', config);
      setReplacements(replacementsResponse.data);
    } catch (err) {
      setError('Ошибка при удалении замены');
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        {currentUser?.role === 'manager' && (
          <div className="replacement-form">
            <h2>Создать замену</h2>
            <div className="form-field">
              <label>Выберите учителя</label>
              <Autocomplete
                value={teachers.find(t => t.id === selectedTeacher)}
                onChange={(event, newValue) => {
                  setSelectedTeacher(newValue ? newValue.id : undefined);
                }}
                options={teachers}
                getOptionLabel={(option) => `${option.name} ${option.surname}`}
                renderInput={(params) => <TextField {...params} />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </div>
            <div className="form-field">
              <label>Выберите заменяющего учителя</label>
              <Autocomplete
                value={teachers.find(t => t.id === replacementTeacher)}
                onChange={(event, newValue) => {
                  setReplacementTeacher(newValue ? newValue.id : undefined);
                }}
                options={teachers}
                getOptionLabel={(option) => `${option.name} ${option.surname}`}
                renderInput={(params) => <TextField {...params} />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </div>
            <div className="form-field">
              <label>Номер урока</label>
              <input
                type="text"
                value={lessonNumber}
                onChange={e => setLessonNumber(e.target.value)}
                pattern="\d*"
                title="Введите номер урока цифрами"
                required
              />
            </div>
            <div className="form-field">
              <label>Класс</label>
              <input
                type="text"
                value={classNumber}
                onChange={e => setClassNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Дата</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!selectedTeacher || !replacementTeacher || !lessonNumber || !classNumber || !date}
            >
              Создать замену
            </button>
          </div>
        )}
        <div className="replacements-container">
          <h1 className="replacements-header">Замены</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="replacements-list">
            {replacements.length > 0 ? (
              replacements.map(r => (
                <div key={r.id} className="replacement-item">
                  <p>
                    {`Заменяемый: ${r.selectedTeacher ? `${r.selectedTeacher.name} ${r.selectedTeacher.surname}` : 'Неизвестно'}, Заменяющий: ${r.replacementTeacher ? `${r.replacementTeacher.name} ${r.replacementTeacher.surname}` : 'Неизвестно'}, Урок: ${r.lessonNumber}, Класс: ${r.classNumber}, Дата: ${new Date(r.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                  </p>
                  {currentUser?.role === 'manager' && (
                    <>
                      <button onClick={() => handleDelete(r.id)}>Удалить</button>
                    </>
                  )}
                </div>
              ))
            ) : <p className="no-replacements">Замен нет.</p>}
          </div>
        </div>
      </div>
    </>
  );    
};

export default ReplacementsPage;
