import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import TasksBoard from './components/TasksBoard/TasksBoard';
import TaskForm from './components/TaskForm/TaskForm';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ClientsPage from './components/ClientsPage/ClientsPage'; 
import EmployeeCodePage from './components/EmployeeCodePage/EmployeeCodePage';
import AdminPage from './components/AdminPage/AdminPage';
import AdminManagerPage from './components/AdminManagerPage/AdminManagerPage';
import AdminEmployeePage from './components/AdminEmployeePage/AdminEmployeePage';
import AdminClientsPage from './components/AdminClientsPage/AdminClientsPage';
import AdminCodePage from './components/AdminCodePage/AdminCodePage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/task_board" element={<TasksBoard />} />
        <Route path="/task_form" element={<TaskForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/code" element={<EmployeeCodePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin_manager" element={<AdminManagerPage />} />
        <Route path="/admin_employee" element={<AdminEmployeePage />} />
        <Route path="/admin_clients" element={<AdminClientsPage />} />
        <Route path="/admin_code" element={<AdminCodePage />} />
      </Routes>
    </Router>
  );
};

export default App;
