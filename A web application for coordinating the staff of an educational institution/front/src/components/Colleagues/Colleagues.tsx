import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Colleagues.css';
import Header from '../Header/Header';

interface Colleague {
  id: number;
  profilePicture: string;
  name: string;
  surname: string;
}

const ColleaguesPage: React.FC = () => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);

  useEffect(() => {
    const fetchColleagues = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3001/api/users/non-admins', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setColleagues(response.data);
      } catch (error) {
        console.error('Ошибка при получении списка коллег:', error);
      }
    };

    fetchColleagues();
  }, []);

  return (
    <>
        <Header />
        <div className="colleagues-container">
      <h2>Все коллеги</h2>
      <ul className="colleagues-list">
        {colleagues.map((colleague) => (
          <li key={colleague.id} className="colleague-item">
            <img src={colleague.profilePicture} alt={colleague.name} />
            <div>{colleague.name} {colleague.surname}</div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default ColleaguesPage;
