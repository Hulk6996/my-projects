import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import './EmployeeCodePage.css';

interface Code {
  id: number;
  code: string;
}

const EmployeeCodePage = () => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(false);
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
      const response = await axios.get('http://localhost:3001/api/employee-code/active');
      setCodes(response.data);
    } catch (error) {
      console.error('Failed to fetch codes:', error);
    }
  };

  const generateCode = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Токен аутентификации не найден');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/api/employee-code/generate', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchCodes();
      setLoading(false);
      alert('Code generated: ' + response.data.code);
    } catch (error) {
      console.error('Failed to generate code:', error);
      setLoading(false);
    }
  };

  return (
    <div className="employee-code-page">
      <SidebarMenu role="manager" onLogout={handleLogout} />
      <h1>Код регистрации для сотрудника</h1>
      <button onClick={generateCode} disabled={loading}>
        {loading ? 'Generating...' : 'Создать код'}
      </button>
      <h2>Активные коды:</h2>
      {codes.length > 0 ? (
        <ul>
          {codes.map((code) => (
            <li className='activeCode' key={code.id}>{code.code}</li>
          ))}
        </ul>
      ) : (
        <p>No active codes available.</p>
      )}
    </div>
  );
};

export default EmployeeCodePage;
