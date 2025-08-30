"use client";

import React from 'react';
import LogoutButton from './logout-button';

const Header: React.FC = () => {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <header className="p-4 shadow-md relative flex items-center justify-between" style={{ backgroundColor: '#f5ffeb' }}>
      <button onClick={handleBack} className="left-4">
        <img src="https://emojitool.com/img/emojidex/1.0.34/leftwards-black-arrow-4840.png" alt="Voltar" style={{ width: '40px', height: '40px' }} />
      </button>
      <div className="flex items-center justify-center">
        <img
          src="https://www.imagenspng.com.br/wp-content/uploads/2015/04/branca-de-neve-cute-maca-06.png"
          alt="Logo"
          style={{ width: '40px', height: '40px', marginRight: '8px' }}
        />
        <h1 className="text-3xl font-bold text-green-800" style={{ fontFamily: 'Arial' }}>WEBDIET</h1>
      </div>
      <div className="right-4">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;