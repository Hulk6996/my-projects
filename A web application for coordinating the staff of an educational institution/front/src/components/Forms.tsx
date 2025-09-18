import React from 'react';
import Entrance from './Entrance';
import Registration from './Registration';

interface FormsProps {
  showRegistrationPopup: boolean;
  toggleRegistrationPopup: () => void;
  setIsAuthenticated: (value: boolean) => void;
}

const Forms: React.FC<FormsProps> = ({
  showRegistrationPopup,
  toggleRegistrationPopup,
  setIsAuthenticated
}) => {
  return (
    <div className='forms'>
      <Entrance setIsAuthenticated={setIsAuthenticated} />
      <Registration toggleRegistrationPopup={toggleRegistrationPopup} />
    </div>
  );
};

export default Forms;

