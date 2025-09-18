import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import { jwtDecode } from 'jwt-decode';
import './TaskForm.css';

type UserRole = 'employee' | 'manager' | 'client';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: { role: UserRole, sub: number } = jwtDecode(token);
        setRole(decoded.role);
        setUserId(decoded.sub);
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
      }
    }
  }, []);

  const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
    setFile(acceptedFiles[0]);
    const fileErrors: string[] = [];
    fileRejections.forEach(rejection => {
      if (rejection.errors) {
        rejection.errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            fileErrors.push('Размер файла превышает допустимый предел (20MB).');
          }
          if (error.code === 'file-invalid-type') {
            fileErrors.push('Недопустимый формат файла. Разрешены только файлы формата docx, jpeg, png.');
          }
        });
      }
    });
    setErrors(fileErrors);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 20000000,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors: string[] = [];

    if (!title) formErrors.push('Название задачи обязательно.');
    if (!price) formErrors.push('Цена обязательна.');
    if (!description) formErrors.push('Описание обязательно.');

    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('userId', String(userId));
    if (file) {
      formData.append('file', file);
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Нет токена авторизации');
      }
      const response = await axios.post('http://localhost:3001/api/tasks', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response);
      navigate('/task_board');
    } catch (error) {
      console.error('Ошибка при отправке задачи:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Сервер ответил:', error.response.status, error.response.data);
        setErrors([`Ошибка сервера: ${error.response.data.message}`]);
      } else {
        setErrors(['Ошибка при отправке задачи.']);
      }
    }
  };

  return (
    <div className="task-form-container">
      <SidebarMenu role="client" onLogout={handleLogout} />
      <form onSubmit={handleSubmit} className="task-form">
        <label>
          Наименование задачи:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название задачи"
            className="task-input"
          />
        </label>
        <label>
          Цена:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Введите цену"
            className="task-input"
          />
        </label>
        <label>
          Описание:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание"
            className="task-textarea"
          />
        </label>
        <label>
          Файл:
          <div {...getRootProps()} className="file-dropzone">
            <input {...getInputProps()} />
            {file ? <p>{file.name}</p> : <p>Перетащите файл сюда или нажмите для выбора</p>}
          </div>
        </label>
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-message">{error}</p>
            ))}
          </div>
        )}
        <button type="submit" className="submit-button">Отправить задачу</button>
      </form>
    </div>
  );
};

export default TaskForm;
