import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import './AdminPage.css';

interface Log {
  action: string;
  userId: number;
  timestamp: string;
  description: string;
}

const AdminPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/logs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch logs');
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="admin-page">
      <SidebarMenu role="admin" onLogout={handleLogout} />
      <div className="admin-content">
        <h1>Журналы действий пользователей</h1>
        {loading && <p>Loading logs...</p>}
        {error && <p className="error">{error}</p>}
        <div className="logs-container">
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              <p><strong>Действие:</strong> {log.action}</p>
              <p><strong>User ID:</strong> {log.userId}</p>
              <p><strong>Отметка времени:</strong> {new Date(log.timestamp).toLocaleString()}</p>
              <p><strong>Описание:</strong> {log.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
