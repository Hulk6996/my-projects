import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import './AdminCodePage.css';

interface Code {
  id: number;
  code: string;
  isActive: boolean;
}

const AdminCodePage: React.FC = () => {
  const [employeeCodes, setEmployeeCodes] = useState<Code[]>([]);
  const [managerCodes, setManagerCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };
  
  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const employeeResponse = await axios.get('http://localhost:3001/api/employee-code/active', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const managerResponse = await axios.get('http://localhost:3001/api/manager-code/active', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setEmployeeCodes(employeeResponse.data);
      setManagerCodes(managerResponse.data);
    } catch (error) {
      console.error('Failed to fetch codes:', error);
      setError('Не удалось загрузить коды');
    }
  };

  const generateCode = async (type: 'employee' | 'manager') => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3001/api/${type}-code/generate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      fetchCodes();
      setLoading(false);
      alert(`Сгенерирован новый код: ${response.data.code}`);
    } catch (error) {
      console.error('Failed to generate code:', error);
      setLoading(false);
      setError('Не удалось сгенерировать код');
    }
  };

  return (
    <div className="admin-code-page">
      <SidebarMenu role="admin" onLogout={handleLogout} />
      <div className="header">
        <h1>Admin - Генерация кодов</h1>
      </div>
      <div className="generate-buttons">
        <button onClick={() => generateCode('employee')} disabled={loading}>
          {loading ? 'Генерация...' : 'Сгенерировать код сотрудника'}
        </button>
        <button onClick={() => generateCode('manager')} disabled={loading}>
          {loading ? 'Генерация...' : 'Сгенерировать код менеджера'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="codes-list">
        <h2>Активные коды сотрудников</h2>
        {employeeCodes.length > 0 ? (
          <ul>
            {employeeCodes.map(code => (
              <li key={code.id}>
                <span>Код: {code.code}</span> | <span>ID: {code.id}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет активных кодов сотрудников</p>
        )}
        <h2>Активные коды менеджеров</h2>
        {managerCodes.length > 0 ? (
          <ul>
            {managerCodes.map(code => (
              <li key={code.id}>
                <span>Код: {code.code}</span> | <span>ID: {code.id}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет активных кодов менеджеров</p>
        )}
      </div>
    </div>
  );
};

export default AdminCodePage;
