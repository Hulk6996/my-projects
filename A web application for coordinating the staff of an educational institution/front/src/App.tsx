import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import NewsFeed from './components/NewsFeed/NewsFeed';
import RegistrationPopup from './components/RegistrationPopup';
import Profile from './components/Profile/Profile';
import Messenger from './components/Messenger/Messenger';
import ColleaguesPage from './components/Colleagues/Colleagues';
import AdminPage from './components/Admin/Admin';
import UnderDevelopmentPage from './components/Development/development';
import Schedule from './components/Schedule/Schedule';
import ReplacementsPage from './components/Replacement/ReplacementsPage';
import Subjects from './components/Subjects/Subjects';
import './App.css';

interface NavigateComponentProps {
  setIsAuthenticated: (value: boolean) => void;
}

const NavigateComponent: React.FC<NavigateComponentProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, [setIsAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/'); 
  };

  return <Profile handleLogout={handleLogout} />;
};

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header/>
              <Main
                showRegistrationPopup={showPopup}
                toggleRegistrationPopup={togglePopup}
                setIsAuthenticated={setIsAuthenticated}
              />
              </>
            }
          />
          <Route
            path="/news"
            element={
              <NewsFeed /> 
            }
          />
          <Route path="/profile" element={<NavigateComponent setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/colleagues" element={<ColleaguesPage />} />
          <Route path="/development" element={<UnderDevelopmentPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/replacements" element={<ReplacementsPage />} />
          <Route path="/subject" element={<Subjects />} />
        </Routes>
        {showPopup && (
          <div className="overlay">
            <RegistrationPopup toggleRegistrationPopup={togglePopup} />
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
