import React from 'react';

interface RegistrationProps {
  toggleRegistrationPopup: () => void;
}

const Registration: React.FC<RegistrationProps> = ({
  toggleRegistrationPopup 
}) => {
  return (
    <div className="registration">
      <button className="btn-reg" onClick={toggleRegistrationPopup}>
         Зарегистрироваться
       </button>
    </div>
  );  
};

export default Registration;
