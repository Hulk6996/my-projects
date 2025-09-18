import React from 'react';
import RegistrationForm from './RegistrationForm';

interface RegistrationPopupProps {
  toggleRegistrationPopup: () => void;
}

const RegistrationPopup: React.FC<RegistrationPopupProps> = ({ toggleRegistrationPopup }) => {
  return (
    <div className="registration-popup">
      <div className="registration-popup-content">
        <RegistrationForm />
        <div className="cl-btn-7" onClick={toggleRegistrationPopup}></div>
      </div>
    </div>
  );
};

export default RegistrationPopup;

