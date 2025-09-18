import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import './ClientsPage.css';

interface Client {
  id: number;
  name: string;
  surname: string;
  email: string; 
  taskCount: number; 
  phone: string;
}

interface Task {
  id: number;
  title: string;
  price: number;
  status: string;
  creationDate: string;
}

type UserRole = 'employee' | 'manager' | 'client';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode<{ role: UserRole }>(token);
      setRole(decoded.role);

      const fetchClients = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/users/clients', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setClients(response.data);
        } catch (error: unknown) {
          const axiosError = error as AxiosError;
          console.error('Failed to fetch clients:', axiosError.response ? axiosError.response.data : axiosError.message);
        }
      };

      fetchClients();
    }
  }, []);

  const handleClientClick = async (client: Client) => {
    setSelectedClient(client);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:3001/api/tasks/by-client/${client.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Failed to fetch client tasks:', axiosError.response ? axiosError.response.data : axiosError.message);
    }
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
    setTasks([]);
  };

  return (
    <div className="clients-page-container">
      {role && <SidebarMenu role={role} onLogout={() => { localStorage.removeItem('authToken'); window.location.href = '/login'; }} />}
      <div className="clients-page">
        <h2>Список клиентов</h2>
        <div className="clients-list">
          {clients.map(client => (
            <div key={client.id} className="client-card" onClick={() => handleClientClick(client)}>
              <h3>{client.name} {client.surname}</h3>
              <p>Email: {client.email}</p>
              <p>Телефон: {client.phone}</p>
              <p>Задачи: {client.taskCount}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedClient && (
        <div className="over" onClick={handleCloseDetails}>
            <div className="client-details" onClick={(e) => e.stopPropagation()}>
                <h2>Задачи клиента: {selectedClient.name} {selectedClient.surname}</h2>
                <div className="tasks-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                    <h3>{task.title}</h3>
                    <p>Сумма: {task.price} ₽</p>
                    <p>Статус: {task.status}</p>
                    <p>Дата создания: {new Date(task.creationDate).toLocaleDateString('ru-RU')}</p>
                </div>
            ))}
            </div>
        </div>
    </div>
    )}
    </div>
  );
};

export default ClientsPage;
