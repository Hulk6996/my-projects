import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface EntranceProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Entrance: React.FC<EntranceProps> = ({ setIsAuthenticated }) => {
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
          navigate('/news');
        }
      } else {
        console.error('Не удалось получить роль пользователя из ответа сервера');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const responseData = axiosError.response.data as { message: string };
        setError(`Ошибка: ${responseData.message || axiosError.response.status}`);
      } else {
        setError('Ошибка сервера или запроса');
      }
      console.error('Ошибка авторизации:', axiosError);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };
  
  return (
    <div className="entrance">
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-log"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-pass"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' className="btn-ent">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Entrance;
