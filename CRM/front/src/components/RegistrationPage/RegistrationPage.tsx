import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import './RegistrationPage.css';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    code: '',
  });

  const [isWorker, setIsWorker] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<'success' | 'error' | null>(null);
  const [registrationError, setRegistrationError] = useState<string>('');
  const [errorFields, setErrorFields] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorFields((prevErrorFields) => ({
      ...prevErrorFields,
      [name]: false,
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[0-9]).{6,}$/;
    return re.test(password);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    let errors = { email: false, password: false, confirmPassword: false };

    if (!validateEmail(formData.email)) {
      setRegistrationError('Некорректный формат электронной почты');
      setRegistrationStatus('error');
      errors.email = true;
    }

    if (!validatePassword(formData.password)) {
      setRegistrationError('Пароль должен содержать как минимум 6 символов и 1 цифру');
      setRegistrationStatus('error');
      errors.password = true;
    }

    if (formData.password !== formData.confirmPassword) {
      setRegistrationError('Пароли не совпадают');
      setRegistrationStatus('error');
      errors.confirmPassword = true;
    }

    setErrorFields(errors);

    if (errors.email || errors.password || errors.confirmPassword) {
      return;
    }

    try {
      const endpoint = isWorker ? 'http://localhost:3001/api/users/register-user' : 'http://localhost:3001/api/users/register-client';
      await axios.post(endpoint, formData);
      setRegistrationStatus('success');
      // Очистка формы
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        code: '',
      });
      setRegistrationError('');
      setErrorFields({ email: false, password: false, confirmPassword: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при регистрации:', error.response?.data || error.message);
        const errorMessage = error.response?.data.message || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.';
        setRegistrationError(errorMessage);
      } else {
        console.error('Ошибка при регистрации:', error);
        setRegistrationError('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
      }
      setRegistrationStatus('error');
    }
  };

  return (
    <div className="registration-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form className="registration-form" onSubmit={handleRegistration}>
        <div className="slider-container">
          <span className={isWorker ? 'activeb' : ''} onClick={() => setIsWorker(true)}>Я работник</span>
          <input type="checkbox" className='slide' id="switch" checked={!isWorker} onChange={() => setIsWorker(!isWorker)} />
          <label className='label' htmlFor="switch">Toggle</label>
          <span className={!isWorker ? 'activeo' : ''} onClick={() => setIsWorker(false)}>Я клиент</span>
        </div>
        <h3>Регистрация {isWorker ? 'работника' : 'клиента'}</h3>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Электронная почта"
          required
          onChange={handleInputChange}
          className={errorFields.email ? 'error' : ''}
        />
        <div className="password-container">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Пароль"
            required
            onChange={handleInputChange}
            className={errorFields.password ? 'error' : ''}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Подтверждение пароля"
            required
            onChange={handleInputChange}
            className={errorFields.confirmPassword ? 'error' : ''}
          />
        </div>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Имя"
          required onChange={handleInputChange}
        />
        <input
          type="text"
          id="surname"
          name="surname"
          placeholder="Фамилия"
          required onChange={handleInputChange}
        />
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="+7 (999) 999-99-99"
          required onChange={handleInputChange}
        />
        {isWorker && (
          <input
            type="text"
            id="code"
            name="code"
            placeholder="Код для регистрации"
            required onChange={handleInputChange}
          />
        )}
        <button type="submit">Зарегистрироваться</button>
        <p className="login-link">
          Уже есть аккаунт? <a href="/login">Войти здесь</a>
        </p>
        {registrationStatus === 'error' && <div className="error-message">{registrationError}</div>}
        {registrationStatus === 'success' && <div className="success-message">Регистрация прошла успешно!</div>}
      </form>
    </div>
  );
};

export default RegistrationPage;
