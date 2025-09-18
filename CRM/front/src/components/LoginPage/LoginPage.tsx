import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import './LoginPage.css';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface ErrorResponse {
  message: string;
}

const LoginPage: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
      localStorage.setItem('authToken', response.data.token.access_token);
      console.log('Токен сохранен:', localStorage.getItem('authToken'));
      console.log('Ответ сервера:', response.data);
      setIsAuthenticated(true);
      const userRole = response.data.token?.role;

      if (userRole) {
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/task_board');
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setError(`Ошибка: ${axiosError.response.data.message || 'Ошибка сервера'}`);
      } else {
        setError('Ошибка сервера или запроса');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 
    handleLogin();
  };

  return (
    <div className="background">
      <div className="shape blue"></div>
      <div className="shape orange"></div>
      <form className="form-container" onSubmit={handleSubmit}>
        <h3>Вход</h3>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type='submit'>Войти</button>
        <p className="register-link">
          Еще нет аккаунта? <a href="/register">Зарегистрироваться здесь</a>
        </p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
