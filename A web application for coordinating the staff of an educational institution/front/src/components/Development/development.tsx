import React from 'react';
import Header from '../Header/Header';


const UnderDevelopmentPage: React.FC = () => {
  return (
    <>
        <Header />
        <div className='container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F0F2F5' }}>
            <h1 className='text' style={{ color: '#000', fontSize: '48px', fontWeight: 'bold', opacity: 0.5, textAlign: 'center' }}>В РАЗРАБОТКЕ</h1>
        </div>
    </>
  );
};

export default UnderDevelopmentPage;