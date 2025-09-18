import React from 'react';
import DescriptionStack from './DescriptionStack';
import Forms from './Forms';

interface MainProps {
  showRegistrationPopup: boolean;
  toggleRegistrationPopup: () => void;
  setIsAuthenticated: (value: boolean) => void; 
}

const Main: React.FC<MainProps> = ({ showRegistrationPopup, toggleRegistrationPopup, setIsAuthenticated }) => {
  return (
    <div className='container'>
        <DescriptionStack />
        <Forms
        showRegistrationPopup={showRegistrationPopup}
        toggleRegistrationPopup={toggleRegistrationPopup}
        setIsAuthenticated={setIsAuthenticated} 
      />
    </div>
  );
};

export default Main;

