import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'male',
    stackCode: '',
  });

  const [registrationStatus, setRegistrationStatus] = useState<'success' | 'error' | null>(null);
  const [registrationError, setRegistrationError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegistration = async (e: React.FormEvent) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setRegistrationError('Пароли не совпадают');
      setRegistrationStatus('error');
      return;
    }
  
    try {
      console.log(formData);
      await axios.post('http://localhost:3001/api/users/registration', formData);
      console.log(formData);
      setRegistrationStatus('success');
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error.response?.data || error.message);

      const errorMessage = error.response?.data.message || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.';
      setRegistrationError(errorMessage);
      setRegistrationStatus('error');
    }
  };

  return (
    <div className="registration-form">
      <div className="registration-container">
        <h2>Регистрация</h2>
        <form onSubmit={handleRegistration}>
          <input type="text" id="firstName" name="firstName" placeholder="Введите ваше имя" required onChange={handleInputChange} />
          <input type="text" id="lastName" name="lastName" placeholder="Введите вашу фамилию" required onChange={handleInputChange} />
          <input type="email" id="email" name="email" placeholder="Введите ваш email" required onChange={handleInputChange} />
          <input type="password" id="password" name="password" placeholder="Введите пароль" required onChange={handleInputChange} />
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Подтвердите пароль" required onChange={handleInputChange} />
          <input type="date" id="dob" name="dateOfBirth" placeholder="Выберите дату рождения" required onChange={handleInputChange} />
          <select id="gender" name="gender" required onChange={handleInputChange}>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
          <input type="text" id="stackCode" name="stackCode" placeholder="Введите код для регистрации" required onChange={handleInputChange} />
          <button type="submit" className="btn-reg">
            Зарегистрироваться
          </button>
        </form>
        {registrationStatus === 'error' && <div className="error-message">{registrationError}</div>}
        {registrationStatus === 'success' && <div className="success-message">Регистрация прошла успешно!</div>}
      </div>
    </div>
  );
};

export default RegistrationForm;